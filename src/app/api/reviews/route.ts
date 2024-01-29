import { connectDB } from '@/configs/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import { Review } from '@/models/Review';
import { Product } from '@/models/Product';
import { validateJWT } from '@/lib/validateJWT';
connectDB();

export async function POST(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    const reqBody = await request.json();
    reqBody.user = userId;
    const newReview = await new Review(reqBody).save();

    const reviews = await Review.find({ product: reqBody.product });

    const averageRating =
      reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(reqBody.product, { rating: averageRating });

    return NextResponse.json({
      message: 'Review added successfully',
      review: newReview
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message
      });
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const product = searchParams.get('product');
    const reviews = await Review.find({ product })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message
      });
    }
  }
}
