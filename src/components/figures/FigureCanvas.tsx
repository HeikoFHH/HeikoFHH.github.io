import { useEffect, useRef, type ReactNode } from "react";

export type Alpha = (a?: number) => string;

export interface Palette {
  ink: Alpha;
  muted: Alpha;
  accent: Alpha;
  line: Alpha;
  surface: Alpha;
}

export interface Pointer {
  x: number;
  y: number;
}

/** A figure draws itself; FigureCanvas owns sizing, input, theme and the frame loop. */
export interface Scene {
  resize(width: number, height: number): void;
  /** `pointer` is null while the visitor isn't hovering, so the scene can idle on its own. */
  draw(ctx: CanvasRenderingContext2D, t: number, pointer: Pointer | null, p: Palette, reduced: boolean): void;
}

const readPalette = (): Palette => {
  const cs = getComputedStyle(document.documentElement);
  const color =
    (name: string): Alpha =>
    (a = 1) =>
      `hsl(${cs.getPropertyValue(name).trim()} / ${a})`;
  return {
    ink: color("--ink"),
    muted: color("--muted"),
    accent: color("--accent"),
    line: color("--line"),
    surface: color("--surface"),
  };
};

interface Props {
  createScene: () => Scene;
  label: string;
  caption: ReactNode;
}

const FigureCanvas = ({ createScene, label, caption }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = createScene();

    let width = 0;
    let height = 0;
    let palette = readPalette();
    let pointer: Pointer | null = null;
    let visible = true;
    let raf = 0;

    const frame = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      scene.draw(ctx, t, pointer, palette, reduced);
      // With reduced motion we only redraw on input, resize and theme changes.
      if (visible && !reduced) raf = requestAnimationFrame(frame);
    };
    const request = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    };

    const resizeObserver = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene.resize(width, height);
      request();
    });
    resizeObserver.observe(wrap);

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) request();
    });
    visibility.observe(wrap);

    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      request();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (reduced) request();
    };
    const onLeave = () => {
      pointer = null;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
    };
  }, [createScene]);

  return (
    <figure className="mt-5">
      <div ref={wrapRef} className="h-52 w-full overflow-hidden rounded-lg border border-line bg-surface sm:h-60">
        <canvas ref={canvasRef} className="block h-full w-full touch-pan-y" role="img" aria-label={label} />
      </div>
      <figcaption className="mt-2 font-mono text-[11px] leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  );
};

export default FigureCanvas;
