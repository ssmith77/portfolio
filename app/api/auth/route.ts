import { NextResponse } from 'next/server';
import { getExpectedToken } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = String(body.password || '');

  if (!password || Buffer.from(password.split('').reverse().join('')).toString('base64') !== getExpectedToken()) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const token = getExpectedToken();
  return NextResponse.json({ token });
}
