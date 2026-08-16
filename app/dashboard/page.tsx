'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Entity = {
  id: number;
  name: string;
  notes?: string | null;
};

type TaskItem = {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  priority: number;
  dueDate?: string | null;
  entityId: number;
  entity?: { name: string };
  subtasks: { id: number; text: string; done: boolean }[];
};

const statuses = ['todo', 'in_progress', 'done'];

export default function DashboardPage() {
  const router = useRouter();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [templateCount, setTemplateCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tasks-admin-token');
    if (!token) {
      router.push('/');
      return;
    }

    const headers = { 'x-admin-token': token };

    Promise.all([
      fetch('/api/entities', { headers }),
      fetch('/api/tasks', { headers }),
      fetch('/api/templates', { headers }),
    ])
      .then(async ([entityRes, taskRes, templateRes]) => {
        if (!entityRes.ok || !taskRes.ok || !templateRes.ok) {
          throw new Error('Session expired');
        }

        const entityData = await entityRes.json();
        const taskData = await taskRes.json();
        const templateData = await templateRes.json();

        setEntities(entityData);
        setTasks(taskData);
        setTemplateCount(Array.isArray(templateData) ? templateData.length : 0);
      })
      .catch(() => {
        localStorage.removeItem('tasks-admin-token');
        router.push('/');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const metrics = useMemo(() => {
    const total = tasks.length;
    const complete = tasks.filter((task) => task.status === 'done').length;
    const overdue = tasks.filter((task) => {
      if (!task.dueDate || task.status === 'done') return false;
      return new Date(task.dueDate) < new Date();
    }).length;
    const byStatus = statuses.map((status) => ({
      status,
      count: tasks.filter((task) => task.status === status).length,
    }));

    return { total, complete, overdue, byStatus };
  }, [tasks]);

  function handleLogout() {
    localStorage.removeItem('tasks-admin-token');
    router.push('/');
  }

  if (loading) {
    return <div className="p-10 text-center text-slate-600">Loading Task&apos;s dashboard...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Task&apos;s</p>
            <h1 className="mt-2 text-3xl font-bold">Savinon Holdings task board</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium hover:bg-slate-700"
          >
            Log out
          </button>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Total tasks" value={String(metrics.total)} accent="cyan" />
          <StatCard label="Completed" value={String(metrics.complete)} accent="emerald" />
          <StatCard label="Overdue" value={String(metrics.overdue)} accent="rose" />
          <StatCard label="Templates" value={String(templateCount)} accent="violet" />
        </section>

        <section className="mb-8 grid gap-4 lg:grid-cols-3">
          {metrics.byStatus.map(({ status, count }) => (
            <div key={status} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm uppercase tracking-wide text-slate-500">{status.replace('_', ' ')}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{count}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Entities</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{entities.length} total</span>
            </div>

            <div className="space-y-3">
              {entities.map((entity) => (
                <Link
                  key={entity.id}
                  href={`/entity/${entity.id}`}
                  className="block rounded-xl border border-slate-200 p-3 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{entity.name}</p>
                      {entity.notes ? <p className="text-xs text-slate-500">{entity.notes}</p> : null}
                    </div>
                    <span className="text-sm text-slate-500">
                      {tasks.filter((task) => task.entityId === entity.id).length} tasks
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Recent work</h2>
            <div className="space-y-3">
              {tasks.slice(0, 10).map((task) => (
                <div key={task.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.entity?.name || 'Entity'}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      {task.status}
                    </span>
                  </div>
                  {task.description ? <p className="mt-2 text-sm text-slate-600">{task.description}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: 'cyan' | 'emerald' | 'rose' | 'violet' }) {
  const colors = {
    cyan: 'bg-cyan-100 text-cyan-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    rose: 'bg-rose-100 text-rose-800',
    violet: 'bg-violet-100 text-violet-800',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[accent]}`}>{label}</div>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
