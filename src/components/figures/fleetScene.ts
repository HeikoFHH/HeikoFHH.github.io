import type { Palette, Pointer, Scene } from "./FigureCanvas";

// Autonomous mobility on demand on a hexagonal grid. Requests appear, a central
// matching assigns each to the nearest idle vehicle, which drives to the customer,
// transports them and drops them off. Customers who wait too long are lost.
// The cursor is a demand hotspot. The running profit stands in for the global reward.

const R = 22; // hex radius (pointy-top)
const HEX_W = Math.sqrt(3) * R;
const VEHICLES = 6;
const SPEED = 64; // px per second
const PATIENCE = 7; // seconds a customer waits before leaving
const MAX_REQUESTS = 8;

interface Cell extends Pointer {}

interface Request {
  origin: Cell;
  dest: Cell;
  born: number;
  status: "waiting" | "assigned" | "riding" | "lost";
  fade: number;
}

interface Vehicle extends Pointer {
  heading: number;
  request: Request | null;
}

interface Popup extends Pointer {
  text: string;
  age: number;
}

export const createFleetScene = (): Scene => {
  let width = 0;
  let height = 0;
  let cells: Cell[] = [];
  let vehicles: Vehicle[] = [];
  let requests: Request[] = [];
  let popups: Popup[] = [];
  let clock = 0;
  let spawnIn = 0;
  let profit = 0;
  let lastT: number | null = null;
  let warmed = false;

  const pick = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
  const dist = (a: Pointer, b: Pointer) => Math.hypot(a.x - b.x, a.y - b.y);

  const reset = () => {
    requests = [];
    popups = [];
    profit = 0;
    clock = 0;
    spawnIn = 0;
    vehicles = Array.from({ length: VEHICLES }, () => {
      const c = pick(cells);
      return { x: c.x, y: c.y, heading: 0, request: null };
    });
    warmed = false;
  };

  const spawn = (pointer: Pointer | null) => {
    if (requests.filter((r) => r.status !== "lost").length >= MAX_REQUESTS) return;
    // with the cursor present, most demand appears around it
    const near = pointer ? cells.filter((c) => dist(c, pointer) < 2.2 * HEX_W) : [];
    const origin = pointer && near.length && Math.random() < 0.75 ? pick(near) : pick(cells);
    const far = cells.filter((c) => dist(c, origin) >= 2.5 * HEX_W);
    if (!far.length) return;
    requests.push({ origin, dest: pick(far), born: clock, status: "waiting", fade: 1 });
  };

  const step = (dt: number, pointer: Pointer | null) => {
    clock += dt;
    spawnIn -= dt;
    if (spawnIn <= 0) {
      spawn(pointer);
      spawnIn = pointer ? 0.6 : 1.1;
    }

    // central matching: oldest waiting request first, nearest idle vehicle
    for (const r of requests.filter((q) => q.status === "waiting").sort((a, b) => a.born - b.born)) {
      let best: Vehicle | null = null;
      for (const v of vehicles) {
        if (!v.request && (!best || dist(v, r.origin) < dist(best, r.origin))) best = v;
      }
      if (best) {
        best.request = r;
        r.status = "assigned";
      }
    }

    for (const r of requests) {
      if (r.status === "waiting" && clock - r.born > PATIENCE) r.status = "lost";
      if (r.status === "lost") r.fade -= dt / 0.9;
    }
    requests = requests.filter((r) => r.fade > 0);

    for (const v of vehicles) {
      const r = v.request;
      if (!r) continue;
      const goal = r.status === "riding" ? r.dest : r.origin;
      const d = dist(v, goal);
      const move = Math.min(SPEED * dt, d);
      if (d > 0.01) {
        v.heading = Math.atan2(goal.y - v.y, goal.x - v.x);
        v.x += ((goal.x - v.x) / d) * move;
        v.y += ((goal.y - v.y) / d) * move;
        profit -= move * 0.03;
      }
      if (d - move < 1) {
        if (r.status === "assigned") {
          r.status = "riding";
        } else {
          const fare = Math.round(dist(r.origin, r.dest) / 6);
          profit += fare;
          popups.push({ x: v.x, y: v.y - 10, text: `+${fare}`, age: 0 });
          requests = requests.filter((q) => q !== r);
          v.request = null;
        }
      }
    }
    for (const p of popups) p.age += dt;
    popups = popups.filter((p) => p.age < 1.1);
  };

  return {
    resize(w, h) {
      width = w;
      height = h;
      const cols = Math.floor((w - HEX_W) / HEX_W);
      const rows = Math.floor((h - 2 * R) / (1.5 * R)) + 1;
      const ox = (w - (cols - 1) * HEX_W - HEX_W / 2) / 2 + HEX_W / 4;
      const oy = (h - (rows - 1) * 1.5 * R) / 2;
      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({ x: ox + c * HEX_W + (r % 2) * (HEX_W / 2), y: oy + r * 1.5 * R });
        }
      }
      reset();
    },

    draw(ctx: CanvasRenderingContext2D, t: number, pointer: Pointer | null, p: Palette, reduced: boolean) {
      if (!warmed) {
        // start with a populated scene instead of an empty grid
        for (let i = 0; i < 90; i++) step(0.1, null);
        warmed = true;
      }
      if (!reduced) {
        const dt = lastT === null ? 0 : Math.min((t - lastT) / 1000, 0.05);
        step(dt, pointer);
      }
      lastT = t;

      // hexagonal grid, with a soft glow around the demand hotspot
      for (const c of cells) {
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = Math.PI / 6 + (k * Math.PI) / 3;
          const x = c.x + R * Math.cos(a);
          const y = c.y + R * Math.sin(a);
          if (k) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.closePath();
        if (pointer) {
          const glow = Math.max(0, 1 - dist(c, pointer) / (2.4 * HEX_W));
          if (glow > 0) {
            ctx.fillStyle = p.accent(glow * 0.16);
            ctx.fill();
          }
        }
        ctx.strokeStyle = p.line(1);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // customers
      for (const r of requests) {
        if (r.status === "riding") continue;
        const { x, y } = r.origin;
        if (r.status === "lost") {
          ctx.strokeStyle = p.muted(0.7 * r.fade);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x - 4, y - 4);
          ctx.lineTo(x + 4, y + 4);
          ctx.moveTo(x + 4, y - 4);
          ctx.lineTo(x - 4, y + 4);
          ctx.stroke();
          continue;
        }
        // patience ring
        const left = Math.max(0, 1 - (clock - r.born) / PATIENCE);
        ctx.strokeStyle = p.accent(r.status === "waiting" ? 0.6 : 0.25);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 9, -Math.PI / 2, -Math.PI / 2 + left * Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = p.accent();
        ctx.beginPath();
        ctx.arc(x, y - 2.5, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y + 3, 4, Math.PI, 0);
        ctx.fill();
      }

      // vehicles, with the leg they are currently driving
      for (const v of vehicles) {
        const r = v.request;
        if (r) {
          const goal = r.status === "riding" ? r.dest : r.origin;
          ctx.strokeStyle = p.accent(r.status === "riding" ? 0.6 : 0.35);
          ctx.lineWidth = 1.25;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(v.x, v.y);
          ctx.lineTo(goal.x, goal.y);
          ctx.stroke();
          ctx.setLineDash([]);
          if (r.status === "riding") {
            ctx.strokeStyle = p.accent();
            ctx.lineWidth = 1.5;
            ctx.strokeRect(goal.x - 4, goal.y - 4, 8, 8);
          }
        }
        ctx.save();
        ctx.translate(v.x, v.y);
        ctx.rotate(v.heading);
        ctx.fillStyle = p.ink(r ? 1 : 0.5);
        ctx.fillRect(-7, -4, 14, 8);
        if (r?.status === "riding") {
          ctx.fillStyle = p.accent();
          ctx.beginPath();
          ctx.arc(1, 0, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // fares
      ctx.font = "600 11px 'JetBrains Mono Variable', ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      for (const pop of popups) {
        ctx.fillStyle = p.accent(1 - pop.age / 1.1);
        ctx.fillText(pop.text, pop.x, pop.y - pop.age * 16);
      }

      // global reward
      ctx.font = "11px 'JetBrains Mono Variable', ui-monospace, monospace";
      ctx.textAlign = "left";
      const label = `global reward ${Math.round(profit)}`;
      const tw = ctx.measureText(label).width;
      ctx.fillStyle = p.surface(0.85);
      ctx.fillRect(8, 8, tw + 12, 20);
      ctx.fillStyle = p.muted();
      ctx.fillText(label, 14, 22);

      if (pointer) {
        ctx.strokeStyle = p.accent(0.5);
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 2.2 * HEX_W, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      void width;
      void height;
    },
  };
};
