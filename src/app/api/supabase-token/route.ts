import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('SUPABASE_JWT_SECRET is not defined');
}

export async function GET() {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Create a JWT that Supabase will accept
    const token = await new SignJWT({
      sub: userId,
      role: 'authenticated',
      aud: 'authenticated'
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(JWT_SECRET));

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}