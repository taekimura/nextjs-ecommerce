import { connectDB } from '@/configs/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { validateJWT } from '@/lib/validateJWT';

connectDB();

export async function POST(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    const reqBody = await request.json();
    reqBody.user = userId;
    await new Order(reqBody).save();

    // Decrease the quantity of the products ordered
    for (let i = 0; i < reqBody.items.length; i++) {
      const product = await Product.findById(reqBody.items[i]._id);
      if (product) {
        product.countInStock -= reqBody.items[i].quantity;
        await product.save();
      }
    }

    return NextResponse.json({
      message: 'Order placed successfully'
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
