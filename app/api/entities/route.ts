import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const entities = await prisma.entity.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(entities);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const entity = await prisma.entity.create({
    data: {
      name: String(body.name || '').trim(),
      notes: body.notes ? String(body.notes) : null,
    },
  });

  return NextResponse.json(entity, { status: 201 });
}
