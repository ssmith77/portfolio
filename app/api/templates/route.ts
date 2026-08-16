import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const templates = await prisma.template.findMany({
    orderBy: { id: 'asc' },
    include: {
      items: {
        orderBy: { order: 'asc' },
      },
    },
  });

  return NextResponse.json(templates);
}
