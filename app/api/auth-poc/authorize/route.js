import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const accessCode = body?.accessCode;

    if (
      !accessCode ||
      accessCode !== process.env.AUTH_POC_ACCESS_CODE
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({ authorized: true });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
