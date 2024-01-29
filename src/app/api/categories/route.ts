import { connectDB } from '@/configs/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/models/Category';
import { validateJWT } from '@/lib/validateJWT';

connectDB();

export async function POST(request: NextRequest) {
  try {
    const userId = await validateJWT(request);
    const reqBody = await request.json();
    const isCategoryExists = await Category.findOne({
      name: reqBody.name
    });

    if (isCategoryExists) {
      throw new Error('Category already exists');
    }

    reqBody.createdBy = userId;
    await new Category(reqBody).save();

    return NextResponse.json({
      message: 'Category created successfully'
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

export async function GET() {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json({
      data: categories
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
