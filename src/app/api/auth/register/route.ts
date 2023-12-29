import { connectDB } from '@/configs/dbConfig';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const userExists = await User.findOne({ email: reqBody.email });
    if (userExists) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(reqBody.password, salt);
    reqBody.password = hashedPassword;

    const newUser = await new User(reqBody).save();
    return NextResponse.json({
      message: 'User created successfully',
      data: newUser
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message
        },
        { status: 400 }
      );
    }
  }
}
