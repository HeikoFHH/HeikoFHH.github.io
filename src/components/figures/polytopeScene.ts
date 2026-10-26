import type { Palette, Pointer, Scene } from "./FigureCanvas";

// Structured RL: the actor outputs a score vector θ and the combinatorial layer
// returns the polytope vertex that maximizes θ·y. Every vertex is a feasible
// action; the vertex only changes when θ crosses into a different normal cone.

// Angles (degrees) of the vertices on an ellipse, so the polygon is always convex.
const ANGLES = [-105, -48, 8, 52, 108, 160, 215];
const SUBSCRIPTS = ["₁", "₂", "₃", "₄", "₅", "₆", "₇"];
const ARROW = 64;

const TAU = Math.PI * 2;
const wrap = (a: number) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;

export const createPolytopeScene = (): Scene => {
  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;
  let verts: Pointer[] = [];
  // outward normal angle of the edge from verts[i] to verts[i + 1]
  let edgeNormals: number[] = [];
  let theta: Pointer = { x: 1, y: -0.2 };

  return {
    resize(w, h) {
      width = w;
      height = h;
      cx = w / 2;
      cy = h / 2 + 4;
      const s = Math.min(h * 0.3, w * 0.17);
      verts = ANGLES.map((deg) => {
        const a = (deg * Math.PI) / 180;
        return { x: cx + Math.cos(a) * s * 1.5, y: cy + Math.sin(a) * s };
      });
      edgeNormals = verts.map((a, i) => {
        const b = verts[(i + 1) % verts.length];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        // pick the perpendicular that points away from the center
        const outward = (dy * (a.x + b.x - 2 * cx) - dx * (a.y + b.y - 2 * cy)) > 0;
        return outward ? Math.atan2(-dx, dy) : Math.atan2(dx, -dy);
      });
    },

    draw(ctx: CanvasRenderingContext2D, t: number, pointer: Pointer | null, p: Palette, reduced: boolean) {
      // Score vector θ: follows the cursor, otherwise slowly sweeps around the polytope.
      let goal: Pointer;
      if (pointer) {
        goal = { x: pointer.x - cx, y: pointer.y - cy };
      } else if (!reduced) {
        const a = t / 2200;
        goal = { x: Math.cos(a), y: Math.sin(a) };
      } else {
        goal = theta;
      }
      const len = Math.hypot(goal.x, goal.y) || 1;
      const ease = reduced ? 1 : 0.14;
      theta = {
        x: theta.x + (goal.x / len - theta.x) * ease,
        y: theta.y + (goal.y / len - theta.y) * ease,
      };
      const tl = Math.hypot(theta.x, theta.y) || 1;
      const ux = theta.x / tl;
      const uy = theta.y / tl;

      // the linear maximization oracle: argmax over vertices of θ·y
      let best = 0;
      let bestScore = -Infinity;
      verts.forEach((v, i) => {
        const score = ux * (v.x - cx) + uy * (v.y - cy);
        if (score > bestScore) {
          bestScore = score;
          best = i;
        }
      });

      // normal cones: the θ-directions that map to each vertex, drawn from the center
      const reach = Math.hypot(width, height);
      verts.forEach((_, i) => {
        const from = edgeNormals[(i - 1 + verts.length) % verts.length];
        const to = edgeNormals[i];
        const sweep = wrap(to - from);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, reach, from, from + sweep, sweep < 0);
        ctx.closePath();
        if (i === best) {
          ctx.fillStyle = p.accent(0.14);
          ctx.fill();
        }
        ctx.strokeStyle = p.line(1);
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // the polytope: opaque so the cones read as emanating from behind it
      ctx.beginPath();
      verts.forEach((v, i) => (i ? ctx.lineTo(v.x, v.y) : ctx.moveTo(v.x, v.y)));
      ctx.closePath();
      ctx.fillStyle = p.surface(1);
      ctx.fill();
      ctx.fillStyle = p.ink(0.06);
      ctx.fill();
      ctx.strokeStyle = p.ink(0.55);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // supporting hyperplane through the selected vertex, orthogonal to θ
      const sv = verts[best];
      ctx.strokeStyle = p.accent(0.85);
      ctx.lineWidth = 1.25;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(sv.x + uy * 78, sv.y - ux * 78);
      ctx.lineTo(sv.x - uy * 78, sv.y + ux * 78);
      ctx.stroke();
      ctx.setLineDash([]);

      // θ arrow
      const tx = cx + ux * ARROW;
      const ty = cy + uy * ARROW;
      ctx.strokeStyle = p.ink();
      ctx.fillStyle = p.ink();
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx - ux * 9 + uy * 4.5, ty - uy * 9 - ux * 4.5);
      ctx.lineTo(tx - ux * 9 - uy * 4.5, ty - uy * 9 + ux * 4.5);
      ctx.closePath();
      ctx.fill();
      ctx.font = "italic 600 13px 'Fraunces Variable', Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("θ", tx + ux * 13, ty + uy * 13);

      // vertices and labels
      ctx.font = "italic 13px 'Fraunces Variable', Georgia, serif";
      verts.forEach((v, i) => {
        const dx = v.x - cx;
        const dy = v.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const chosen = i === best;
        ctx.fillStyle = chosen ? p.accent() : p.ink(0.7);
        ctx.beginPath();
        ctx.arc(v.x, v.y, chosen ? 4.5 : 3.2, 0, TAU);
        ctx.fill();
        if (chosen) {
          ctx.strokeStyle = p.accent(0.9);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(v.x, v.y, 9, 0, TAU);
          ctx.stroke();
        }
        ctx.fillStyle = chosen ? p.accent() : p.muted();
        ctx.fillText(`y${SUBSCRIPTS[i]}`, v.x + (dx / d) * 20, v.y + (dy / d) * 17);
      });
    },
  };
};
