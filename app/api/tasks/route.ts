import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const entityId = url.searchParams.get('entityId');

  const tasks = await prisma.task.findMany({
    where: entityId ? { entityId: Number(entityId) } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      entity: true,
      subtasks: true,
    },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const task = await prisma.task.create({
    data: {
      entityId: Number(body.entityId),
      title: String(body.title || '').trim(),
      description: body.description ? String(body.description) : null,
      status: String(body.status || 'todo'),
      priority: Number(body.priority || 2),
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      subtasks: {
        create: [
          { text: 'Review task details', done: false },
          { text: 'Mark completion when ready', done: false },
        ],
      },
    },
    include: {
      entity: true,
      subtasks: true,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
