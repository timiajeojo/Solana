// app/api/nowpayments/create/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId, userId } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Minimum deposit is $1.00' }, { status: 400 });
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://solana-nu-six.vercel.app';

    const res = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'x-api-key':    apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount:        amount,
        price_currency:      'usd',
        pay_currency:        'sol',
        order_id:            orderId,
        order_description:   `Deposit for user ${userId}`,
        ipn_callback_url:    `${appUrl}/api/nowpayments/webhook`,
        is_fixed_rate:       false,
        is_fee_paid_by_user: false,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('NOWPayments create error:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to create payment' },
        { status: res.status }
      );
    }

    return NextResponse.json({
      paymentId:     data.payment_id,
      payAddress:    data.pay_address,
      payAmount:     data.pay_amount,
      payCurrency:   data.pay_currency,
      priceAmount:   data.price_amount,
      priceCurrency: data.price_currency,
      status:        data.payment_status,
      expiresAt:     data.expiration_estimate_date ?? null,
    });

  } catch (error: any) {
    console.error('Create payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
