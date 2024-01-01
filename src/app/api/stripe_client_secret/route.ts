import { NextRequest, NextResponse } from 'next/server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: reqBody.amount * 100,
      currency: 'cad',
      description: 'SOZAI. payment'
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message
        },
        { status: 500 }
      );
    }
  }
}
