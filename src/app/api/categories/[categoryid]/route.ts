import { connectDB } from '@/configs/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/models/Category';
import { validateJWT } from '@/lib/validateJWT';

connectDB();

export async function PUT(
  request: NextRequest,
  {
    params
  }: {
    params: {
      categoryid: string;
    };
  }
) {
  try {
    await validateJWT(request);
    const reqBody = await request.json();
    await Category.findByIdAndUpdate(params.categoryid, reqBody);
    return NextResponse.json({
      message: 'Category updated successfully'
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { categoryid: string } }
) {
  try {
    await validateJWT(request);
    await Category.findByIdAndDelete(params.categoryid);
    return NextResponse.json({
      message: 'Category deleted successfully'
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
