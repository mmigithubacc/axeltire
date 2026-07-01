/**
 * Stripe success redirect. Verifies the session was actually paid (server-side)
 * before marking the order Paid, then sends the customer to their account.
 */
import type { APIRoute } from 'astro';
import { stripe, adminDb } from '../../lib/server';

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect }) => {
  const sessionId = new URL(request.url).searchParams.get('session_id');
  if (!sessionId || !stripe) return redirect('/shop');

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const ref = session.metadata?.ref;
    if (session.payment_status === 'paid' && ref) {
      const db = adminDb();
      if (db) await db.from('orders').update({ status: 'Paid' }).eq('ref', ref);
      return redirect(`/account?paid=1&order=${ref}`);
    }
  } catch {
    /* fall through */
  }
  return redirect('/shop?canceled=1');
};
