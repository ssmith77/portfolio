'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

type Entity = { id: number; name: string; notes?: string | null };
type TaskItem = {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  priority: number;
  dueDate?: string | null;
  subtasks: { id: number; text: string; done: boolean }[];
};

type TemplateItem = { id: number; title: string; description?: string | null; order: number };

export default function EntityPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [entity, setEntity] = useState<Entity | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formState, setFormState] = useState({ title: '', description: '', priority: '2', dueDate: '', status: 'todo' });

  useEffect(() => {
    const token = localStorage.getItem('tasks-admin-token');
    if (!token) {
      router.push('/');
      return;
    }

    const headers = { 'x-admin-token': token };
    Promise.all([
      fetch('/api/entities', { headers }),
      fetch(`/api/tasks?entityId=${id}`, { headers }),
      fetch('/api/templates', { headers }),
    ])
      .then(async ([entityRes, taskRes, templateRes]) => {
        if (!entityRes.ok || !taskRes.ok || !templateRes.ok) {
          throw new Error('Unauthorized');
        }

        const entityData = await entityRes.json();
        const taskData = await taskRes.json();
        const templateData = await templateRes.json();
		
        const selected = entityData.find((entry: Entity) => entry.id === id);
        setEntity(selected || null);
        setTasks(taskData);
        setTemplates(templateData.flatMap((template: { items: TemplateItem[] }) => template.items));
      })
      .catch(() => {
        localStorage.removeItem('tasks-admin-token');
        router.push('/');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = localStorage.getItem('tasks-admin-token');
    if (!token || !entity) return;

    setCreating(true);
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({
        entityId: entity.id,
        title: formState.title,
        description: formState.description,
        priority: Number(formState.priority),
        dueDate: formState.dueDate || null,
        status: formState.status,
      }),
    });

    if (response.ok) {
      const nextTask = await response.json();
      setTasks((current) => [nextTask, ...current]);
      setFormState({ title: '', description: '', priority: '2', dueDate: '', status: 'todo' });
    }

    setCreating(false);
  }

  async function toggleSubtask(taskId: number, subtaskId: number, done: boolean) {
    const token = localStorage.getItem('tasks-admin-token');
    if (!token) return;

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({ subtaskId, done }),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      setTasks((current) => current.map((task) => (task.id === taskId ? updatedTask : task)));
    }
  }

  async function updateStatus(taskId: number, status: string) {
    const token = localStorage.getItem('tasks-admin-token');
    if (!token) return;

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      setTasks((current) => current.map((task) => (task.id === taskId ? updatedTask : task)));
    }
  }

  if (loading) {
    return <div className="p-10 text-center text-slate-600">Loading entity details...</div>;
  }

  if (!entity) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl font-semibold text-slate-800">Entity not found</p>
        <Link href="/dashboard" className="mt-4 inline-block text-cyan-700 underline">Return to dashboard</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-sm text-cyan-700 underline">Back to dashboard</Link>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{entity.name}</h1>
          </div>
        </header>

        <section className="mb-6 grid gap-6 lg:grid-cols-[1.05fr_1.5fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Create task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                value={formState.title}
                onChange={(event) => setFormState({ ...formState, title: event.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="Task name"
                required
              />
              <textarea
                value={formState.description}
                onChange={(event) => setFormState({ ...formState, description: event.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="Task description"
                rows={4}
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <select
                  value={formState.status}
                  onChange={(event) => setFormState({ ...formState, status: event.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                >
                  <option value="todo">todo</option>
                  <option value="in_progress">in progress</option>
                  <option value="done">done</option>
                </select>
                <select
                  value={formState.priority}
                  onChange={(event) => setFormState({ ...formState, priority: event.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                >
                  <option value="1">High</option>
                  <option value="2">Medium</option>
                  <option value="3">Low</option>
                </select>
                <input
                  type="date"
                  value={formState.dueDate}
                  onChange={(event) => setFormState({ ...formState, dueDate: event.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <button type="submit" disabled={creating} className="w-full rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">
                {creating ? 'Saving...' : 'Create task'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Quick templates</h2>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setFormState((current) => ({ ...current, title: template.title, description: template.description || current.description }))}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left hover:border-cyan-300 hover:bg-cyan-50"
                >
                  <span className="font-medium text-slate-800">{template.title}</span>
                  <span className="text-xs text-slate-500">template</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Tasks</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{task.title}</p>
                    {task.description ? <p className="text-sm text-slate-600">{task.description}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(event) => updateStatus(task.id, event.target.value)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                    >
                      <option value="todo">todo</option>
                      <option value="in_progress">in progress</option>
                      <option value="done">done</option>
                    </select>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">P{task.priority}</span>
                  </div>
                </div>

                {task.subtasks.length > 0 ? (
                  <div className="mt-4 space-y-2">
                    {task.subtasks.map((subtask) => (
                      <label key={subtask.id} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={subtask.done}
                          onChange={() => toggleSubtask(task.id, subtask.id, !subtask.done)}
                        />
                        <span className={subtask.done ? 'line-through text-slate-400' : ''}>{subtask.text}</span>
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
