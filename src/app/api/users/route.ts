import { NextResponse } from 'next/server';
import { connectDB } from '@/configs/dbConfig';

connectDB();

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        id: 1,
        name: 'Tae Kimura'
      }
    ]
  });
}
