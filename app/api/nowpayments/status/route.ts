// app/api/nowpayments/status/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const paymentId = req.nextUrl.searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId is required' }, { status: 400 });
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 });
    }

    const res = await fetch(
      `https://api.nowpayments.io/v1/payment/${paymentId}`,
      { headers: { 'x-api-key': apiKey } }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch status' },
        { status: res.status }
      );
    }

    return NextResponse.json({
      status:          data.payment_status,
      payAmount:       data.pay_amount,
      actuallyPaid:    data.actually_paid,
      payAddress:      data.pay_address,
      priceAmount:     data.price_amount,
      priceCurrency:   data.price_currency,
    });

  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
