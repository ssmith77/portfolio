// Extension: tasks-canvas
// A canvas for the Task's Savinon entity task manager.

import { createServer } from "node:http";
import { joinSession, createCanvas } from "@github/copilot-sdk/extension";

const servers = new Map();

const entities = [
  { name: "Savinon Holdings LLC", status: "Overview" },
  { name: "OpCo 1", status: "Formation" },
  { name: "OpCo 2", status: "Prep" },
  { name: "OpCo 3", status: "Formation" },
  { name: "OpCo 4", status: "Planning" },
  { name: "OpCo 5", status: "Setup" },
  { name: "OpCo 6", status: "Planning" },
  { name: "OpCo 7", status: "Setup" },
  { name: "OpCo 8", status: "Prep" },
  { name: "OpCo 9", status: "Review" },
  { name: "OpCo 10", status: "Planning" },
  { name: "Management LLC (S-Corp)", status: "Payroll" },
];

const templates = [
  "Entity Formation",
  "Banking setup",
  "Payroll & compensation",
  "Compliance tracking",
];

function renderHtml(instanceId) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Task's canvas</title>
    <style>
      :root {
        --bg: #0f172a;
        --panel: #111827;
        --panel-alt: #1f2937;
        --border: #334155;
        --text: #e2e8f0;
        --muted: #94a3b8;
        --accent: #22d3ee;
        --accent-strong: #67e8f9;
        --success: #34d399;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 24px;
      }
      .shell {
        max-width: 980px;
        margin: 0 auto;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      .eyebrow {
        color: var(--accent-strong);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 11px;
        font-weight: 700;
      }
      h1 {
        margin: 8px 0 0;
        font-size: 30px;
      }
      .badge {
        background: #0b1120;
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 8px 12px;
        color: var(--accent-strong);
        font-size: 12px;
        font-weight: 600;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }
      .card {
        background: linear-gradient(180deg, rgba(17,24,39,0.9), rgba(15,23,42,0.75));
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 18px;
      }
      .card h3 {
        color: var(--muted);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin: 0 0 14px;
      }
      .metric {
        font-size: 32px;
        font-weight: 700;
        margin: 0;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 8px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
        color: var(--text);
      }
      li:last-child { border-bottom: none; }
      .status {
        color: var(--success);
        font-weight: 600;
      }
      .muted { color: var(--muted); }
      code {
        color: var(--accent-strong);
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <div class="header">
        <div>
          <div class="eyebrow">Task's</div>
          <h1>Entity task board</h1>
        </div>
        <div class="badge">Live overview</div>
      </div>

      <div class="grid">
        <div class="card">
          <h3>Entities</h3>
          <p class="metric">12</p>
        </div>
        <div class="card">
          <h3>Active tasks</h3>
          <p class="metric">24</p>
        </div>
        <div class="card">
          <h3>Templates</h3>
          <p class="metric">4</p>
        </div>
        <div class="card">
          <h3>Due soon</h3>
          <p class="metric">7</p>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <h3>Entity status</h3>
          <ul>
            ${entities.map((entity) => `
              <li>
                <span>${entity.name}</span>
                <span class="status">${entity.status}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="card">
          <h3>Templates</h3>
          <ul>
            ${templates.map((template) => `
              <li>
                <span>${template}</span>
                <span class="muted">Ready</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div class="card">
        <h3>Canvas instance</h3>
        <p class="muted">Open panel: <code>${instanceId}</code></p>
        <p class="muted">This canvas is scoped to the Task's Savinon operating dashboard and tracks entity-level workload.</p>
      </div>
    </div>
  </body>
</html>`;
}

async function startServer(instanceId) {
  const server = createServer((req, res) => {
    if (req.url === "/api/status") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ instanceId, entities: entities.length, templates: templates.length }));
      return;
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(renderHtml(instanceId));
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return { server, url: `http://127.0.0.1:${port}/` };
}

const session = await joinSession({
  canvases: [
    createCanvas({
      id: "tasks-canvas",
      displayName: "Task's canvas",
      description: "Overview canvas for Savinon entity tasks and operational tracking.",
      actions: [
        {
          name: "status",
          description: "Return the current Task's canvas summary data.",
          handler: async (ctx) => ({
            ok: true,
            instanceId: ctx.instanceId,
            entities: entities.length,
            templates: templates.length,
          }),
        },
      ],
      open: async (ctx) => {
        let entry = servers.get(ctx.instanceId);
        if (!entry) {
          entry = await startServer(ctx.instanceId);
          servers.set(ctx.instanceId, entry);
        }
        return {
          title: "Task's overview",
          url: entry.url,
        };
      },
      onClose: async (ctx) => {
        const entry = servers.get(ctx.instanceId);
        if (entry) {
          servers.delete(ctx.instanceId);
          await new Promise((resolve) => entry.server.close(() => resolve()));
        }
      },
    }),
  ],
});
