import { NextResponse } from 'next/server';

export async function GET(
  _: NextResponse,
  { params }: { params: { userId: number } }
) {
  const userId = params.userId;

  return NextResponse.json({
    success: true,
    data: [
      {
        id: userId,
        name: 'Tae Kimura'
      }
    ]
  });
}
