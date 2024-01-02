import { connectDB } from '@/configs/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/User';
import { validateJWT } from '@/lib/validateJWT';

connectDB();

export async function GET(request: NextRequest) {
  try {
    await validateJWT(request);
    const users = await User.find().select('-password');
    return NextResponse.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
