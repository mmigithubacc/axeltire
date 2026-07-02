/**
 * Creates a Stripe Checkout Session for the current cart.
 *
 * Runs as the signed-in customer (their access token), so it reads prices from
 * the public catalog view and records the pending order under RLS — no
 * service-role key required. Prices are recomputed here; client amounts are
 * never trusted.
 */
import type { APIRoute } from 'astro';
import { stripe, authedClient, isPaymentsConfigured, jsonResponse } from '../../lib/server';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    return await handler(request);
  } catch (e: any) {
    // Never let an exception return an HTML crash page — surface the reason.
    return jsonResponse({ error: `Checkout failed: ${e?.message || 'unknown error'}` }, 500);
  }
};

async function handler(request: Request): Promise<Response> {
  if (!isPaymentsConfigured || !stripe) {
    return jsonResponse({ error: 'Online payment is not enabled yet.' }, 503);
  }

  const body = await request.json().catch(() => null);
  const cart: { sku: string; qty: number }[] = body?.items ?? [];
  if (!Array.isArray(cart) || cart.length === 0) {
    return jsonResponse({ error: 'Your cart is empty.' }, 400);
  }

  const db = authedClient(body?.token);
  if (!db) return jsonResponse({ error: 'Server not configured.' }, 503);

  // Require a signed-in customer.
  const { data: { user } } = await db.auth.getUser();
  if (!user) return jsonResponse({ error: 'Please sign in to pay.' }, 401);

  // Recompute prices from the public catalog view (anti-tampering).
  const skus = cart.map((i) => i.sku).filter(Boolean);
  const { data: tires, error: lookupError } = await db
    .from('tires_public')
    .select('sku, brand, model, size, price, stock')
    .in('sku', skus);
  if (lookupError) {
    return jsonResponse({ error: `Price lookup failed: ${lookupError.message}` }, 500);
  }
  const bySku = new Map((tires ?? []).map((t: any) => [t.sku, t]));

  const lineItems: any[] = [];
  const orderItems: any[] = [];
  let total = 0;
  for (const item of cart) {
    const t = bySku.get(item.sku);
    if (!t || t.stock <= 0) continue;
    const qty = Math.max(1, Math.min(50, Number(item.qty) || 1));
    total += t.price * qty;
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: 'cad',
        unit_amount: Math.round(t.price * 100),
        product_data: { name: `${t.brand} ${t.model} — ${t.size}` },
      },
    });
    orderItems.push({ sku: t.sku, name: `${t.brand} ${t.model}`, size: t.size, price: t.price, qty });
  }
  if (lineItems.length === 0) {
    return jsonResponse(
      { error: `No purchasable items (requested ${skus.length}, matched ${tires?.length ?? 0}).` },
      400,
    );
  }

  const ref = 'AX-' + String(Date.now()).slice(-6);
  const customer = body?.customer ?? {};

  // Record a pending order as this customer (RLS: user_id = auth.uid()).
  const { error: insertError } = await db.from('orders').insert({
    ref, user_id: user.id, items: orderItems, total, status: 'Pending payment', customer,
  });
  if (insertError) {
    return jsonResponse({ error: `Could not save order: ${insertError.message}` }, 500);
  }

  const origin = new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    customer_email: user.email ?? undefined,
    metadata: { ref },
    success_url: `${origin}/api/order-complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop?canceled=1`,
  });

  return jsonResponse({ url: session.url });
}
