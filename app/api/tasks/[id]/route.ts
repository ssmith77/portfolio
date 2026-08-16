import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const taskId = Number(params.id);

  if (body.subtaskId) {
    const subtask = await prisma.subtask.update({
      where: { id: Number(body.subtaskId) },
      data: { done: Boolean(body.done) },
    });

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { entity: true, subtasks: true },
    });

    return NextResponse.json(task);
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: body.status ? String(body.status) : undefined,
    },
    include: { entity: true, subtasks: true },
  });

  return NextResponse.json(task);
}
