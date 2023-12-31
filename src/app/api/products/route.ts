import { connectDB } from '@/configs/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import { validateJWT } from '@/lib/validateJWT';

connectDB();

export async function POST(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    // check if product already exists
    const reqBody = await request.json();
    const productExists = await Product.findOne({
      name: reqBody.name
    });
    if (productExists) {
      throw new Error('Product already exists');
    }

    reqBody.createdBy = userId;
    await new Product(reqBody).save();

    return NextResponse.json({
      message: 'Product created successfully'
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        {
          status: 500
        }
      );
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const filters: any = {};
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    if (category) {
      filters['category'] = category;
    }

    if (search) {
      filters['name'] = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filters)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    return NextResponse.json({
      data: products
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        {
          status: 500
        }
      );
    }
  }
}
