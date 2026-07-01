/**
 * Creates a Stripe Checkout Session for the current cart.
 * Prices are recomputed from the database — client amounts are never trusted.
 */
import type { APIRoute } from 'astro';
import { stripe, adminDb, userFromToken, isPaymentsConfigured, jsonResponse } from '../../lib/server';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!isPaymentsConfigured || !stripe) {
    return jsonResponse({ error: 'Online payment is not enabled yet.' }, 503);
  }

  const body = await request.json().catch(() => null);
  const cart: { sku: string; qty: number }[] = body?.items ?? [];
  if (!Array.isArray(cart) || cart.length === 0) {
    return jsonResponse({ error: 'Your cart is empty.' }, 400);
  }

  // Require a signed-in customer.
  const user = await userFromToken(body?.token);
  if (!user) return jsonResponse({ error: 'Please sign in to pay.' }, 401);

  const db = adminDb();
  if (!db) return jsonResponse({ error: 'Server not configured.' }, 503);

  // Recompute prices from the DB (anti-tampering).
  const skus = cart.map((i) => i.sku);
  const { data: tires } = await db
    .from('tires')
    .select('sku, brand, model, size, price, stock')
    .in('sku', skus);
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
  if (lineItems.length === 0) return jsonResponse({ error: 'No purchasable items in cart.' }, 400);

  const ref = 'AX-' + String(Date.now()).slice(-6);
  const customer = body?.customer ?? {};

  // Record a pending order (service role bypasses RLS).
  await db.from('orders').insert({
    ref, user_id: user.id, items: orderItems, total, status: 'Pending payment', customer,
  });

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
};
