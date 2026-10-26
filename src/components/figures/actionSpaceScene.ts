import type { Palette, Pointer, Scene } from "./FigureCanvas";

// Distance-guided RL (Sampled Dynamic Neighborhood): the actor's proto-action
// (the cursor) defines an L∞ ball. Only K random valid actions from inside it are
// drawn and scored by the critic; the highest-valued sample is executed, which is
// usually not the nearest. The draw is stochastic and refreshed over time.
// Dot values are random but fixed, standing in for Q.

const SPACING = 30;
const JITTER = 7;
const RADIUS = 1.6 * SPACING;
const K = 4;
const REDRAW_MS = 1300;

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

interface Dot extends Pointer {
  /** stand-in for the critic's Q-value, in [0, 1) */
  q: number;
  /** fixed sampling order, so the sampled subset doesn't flicker */
  key: number;
}

export const createActionSpaceScene = (): Scene => {
  let width = 0;
  let height = 0;
  let dots: Dot[] = [];
  let current: Pointer = { x: 0, y: 0 };
  let target: Pointer = { x: 0, y: 0 };
  let placed = false;
  let sampled: Dot[] = [];
  let lastDraw = -Infinity;

  return {
    resize(w, h) {
      width = w;
      height = h;
      dots = [];
      const cols = Math.floor(w / SPACING);
      const rows = Math.floor(h / SPACING);
      const ox = (w - (cols - 1) * SPACING) / 2;
      const oy = (h - (rows - 1) * SPACING) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          dots.push({
            x: ox + c * SPACING + (hash(i) - 0.5) * 2 * JITTER,
            y: oy + r * SPACING + (hash(i + 999) - 0.5) * 2 * JITTER,
            q: hash(i + 4242),
            key: hash(i + 7777),
          });
        }
      }
      if (!placed) {
        current = { x: w * 0.62, y: h * 0.5 };
        target = { ...current };
        placed = true;
      }
    },

    draw(ctx: CanvasRenderingContext2D, t: number, pointer: Pointer | null, p: Palette, reduced: boolean) {
      if (pointer) {
        target = pointer;
      } else if (!reduced) {
        // idle: the proto-action wanders on a slow Lissajous path
        target = {
          x: width * (0.5 + 0.36 * Math.sin(t / 2600)),
          y: height * (0.5 + 0.3 * Math.sin(t / 1900 + 1)),
        };
      }
      const ease = reduced ? 1 : 0.1;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;

      // The L∞ ball holds many valid actions; only K random ones are drawn.
      const ball = dots.filter((d) => Math.abs(d.x - current.x) <= RADIUS && Math.abs(d.y - current.y) <= RADIUS);
      const expired = t - lastDraw > REDRAW_MS;
      sampled = expired ? [] : sampled.filter((d) => ball.includes(d));
      const pool = ball.filter((d) => !sampled.includes(d));
      while (sampled.length < Math.min(K, ball.length) && pool.length) {
        sampled.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      }
      if (expired) lastDraw = t;
      const hood = sampled;
      const chosen = hood.reduce<Dot | null>((best, d) => (!best || d.q > best.q ? d : best), null);

      for (const d of dots) {
        ctx.fillStyle = p.muted(0.3);
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // the L∞ ball around the proto-action
      ctx.strokeStyle = p.ink(0.35);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.strokeRect(current.x - RADIUS, current.y - RADIUS, 2 * RADIUS, 2 * RADIUS);
      ctx.setLineDash([]);

      for (const d of ball) {
        if (hood.includes(d)) continue;
        ctx.fillStyle = p.ink(0.35);
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = "10px 'JetBrains Mono Variable', ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      for (const d of hood) {
        const isChosen = d === chosen;
        ctx.strokeStyle = p.accent(isChosen ? 0.85 : 0.14);
        ctx.lineWidth = isChosen ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
      }
      for (const d of hood) {
        const isChosen = d === chosen;
        ctx.fillStyle = p.accent(isChosen ? 1 : 0.3 + d.q * 0.45);
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2.4 + d.q * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = isChosen ? p.accent() : p.muted(0.95);
        ctx.fillText(String(Math.round(10 + d.q * 89)), d.x + 10, d.y - 8);
      }

      if (chosen) {
        ctx.strokeStyle = p.accent(0.9);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(chosen.x, chosen.y, 9, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = p.ink();
      ctx.beginPath();
      ctx.arc(current.x, current.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    },
  };
};
