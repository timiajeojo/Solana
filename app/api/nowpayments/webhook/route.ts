// app/api/nowpayments/webhook/route.ts
// NOWPayments sends a POST request here when a payment status changes.
// We verify the IPN signature and update the deposit in Supabase.

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Use service-role key so we can write to DB from server without RLS blocking
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret) return false;
  const hash = crypto
    .createHmac('sha512', secret)
    .update(payload)
    .digest('hex');
  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const body      = await req.text();
    const signature = req.headers.get('x-nowpayments-sig') ?? '';

    // Verify the request is genuinely from NOWPayments
    if (!verifySignature(body, signature)) {
      console.error('Invalid IPN signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(body);
    const {
      payment_id,
      payment_status,
      price_amount,
      pay_currency,
      order_id,
      actually_paid,
    } = data;

    console.log(`IPN received: payment ${payment_id} → ${payment_status}`);

    // Extract userId from orderId (format: "userId_timestamp")
    const userId = order_id?.split('_')[0];
    if (!userId) {
      return NextResponse.json({ error: 'Invalid order_id' }, { status: 400 });
    }

    // Map NOWPayments status to our deposit status
    const depositStatus =
      payment_status === 'finished'  ? 'completed' :
      payment_status === 'confirmed' ? 'completed' :
      payment_status === 'failed'    ? 'failed'    :
      payment_status === 'expired'   ? 'failed'    :
      'pending';

    // Check if a deposit record already exists for this payment
    const { data: existing } = await supabaseAdmin
      .from('deposits')
      .select('id')
      .eq('payment_id', payment_id)
      .single();

    if (existing) {
      // Update existing deposit
      await supabaseAdmin
        .from('deposits')
        .update({ status: depositStatus, updated_at: new Date().toISOString() })
        .eq('payment_id', payment_id);
    } else {
      // Insert new deposit record
      await supabaseAdmin
        .from('deposits')
        .insert({
          user_id:    userId,
          amount:     price_amount,
          plan:       `SOL Deposit (${pay_currency?.toUpperCase()})`,
          status:     depositStatus,
          payment_id: payment_id,
        });
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
