import type { ReactNode } from "react";

// Algorithm schemes redrawn as SVG so they follow the site theme (the paper figures
// are fixed-color PDFs). Notation follows the papers.

const PW = 150; // panel width
const PH = 116; // panel height
const PANEL_X = [8, 203, 398, 593];

const rand = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** A scatter of valid actions inside a panel, identical across panels. */
const CLOUD = Array.from({ length: 36 }, (_, i) => ({
  x: 10 + rand(3 + i) * (PW - 20),
  y: 10 + rand(53 + i) * (PH - 20),
}));
const A = { x: 74, y: 58 }; // proto-action
const HALF = 30; // half-size of the L∞ ball
const inBall = CLOUD.filter((d) => Math.abs(d.x - A.x) <= HALF && Math.abs(d.y - A.y) <= HALF);
const SAMPLED = [...inBall].sort((a, b) => rand(a.x * 7 + a.y) - rand(b.x * 7 + b.y)).slice(0, 4);

const Defs = ({ id }: { id: string }) => (
  <defs>
    <marker id={`${id}-ink`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto" className="text-muted">
      <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
    </marker>
    <marker id={`${id}-acc`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto" className="text-accent">
      <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
    </marker>
  </defs>
);

const Sub = ({ children, dy = 3 }: { children: ReactNode; dy?: number }) => (
  <tspan dy={dy} fontSize="0.7em">
    {children}
  </tspan>
);
const Back = () => <tspan dy="-3" fontSize="1em" />;

interface PanelProps {
  index: number;
  step: string;
  note: ReactNode;
  sub: ReactNode;
  children: ReactNode;
}

const Panel = ({ index, step, note, sub, children }: PanelProps) => (
  <g transform={`translate(${PANEL_X[index]},0)`}>
    <text x={0} y={14} className="fill-accent font-mono" fontSize={10} letterSpacing="0.14em">
      {step}
    </text>
    <rect x={0} y={24} width={PW} height={PH} rx={8} className="fill-surface stroke-line" />
    <g transform="translate(0,24)">{children}</g>
    <text x={PW / 2} y={172} textAnchor="middle" className="fill-ink font-serif" fontStyle="italic" fontSize={16}>
      {note}
    </text>
    <text x={PW / 2} y={192} textAnchor="middle" className="fill-muted font-sans" fontSize={12}>
      {sub}
    </text>
  </g>
);

const Arrows = ({ id, accent = false }: { id: string; accent?: boolean }) => (
  <>
    {[0, 1, 2].map((i) => (
      <line
        key={i}
        x1={PANEL_X[i] + PW + 8}
        y1={82}
        x2={PANEL_X[i + 1] - 8}
        y2={82}
        className={accent ? "stroke-accent" : "stroke-muted"}
        strokeWidth={1.5}
        markerEnd={`url(#${id}-${accent ? "acc" : "ink"})`}
      />
    ))}
  </>
);

const Cloud = ({ faint = false }: { faint?: boolean }) => (
  <>
    {CLOUD.map((d, i) => (
      <circle key={i} cx={d.x} cy={d.y} r={2} className="fill-muted" opacity={faint ? 0.25 : 0.55} />
    ))}
  </>
);

const Proto = () => (
  <>
    <circle cx={A.x} cy={A.y} r={9} className="fill-accent" opacity={0.18} />
    <circle cx={A.x} cy={A.y} r={4.5} className="fill-accent" />
  </>
);

/** Scrolls horizontally on narrow screens instead of shrinking the text. */
const Scheme = ({ children, label }: { children: ReactNode; label: string }) => (
  <div className="overflow-x-auto">
    <svg role="img" aria-label={label} viewBox="0 0 750 200" className="h-auto w-full min-w-[620px]">
      {children}
    </svg>
  </div>
);

const Phi = () => (
  <>
    φ<Sub>θ</Sub>
    <Back />
  </>
);

export const SdnScheme = () => (
  <Scheme label="Scheme of Sampled Dynamic Neighborhood: the actor's proto-action defines an L-infinity neighborhood, K candidate actions are drawn from it based on their distance to the proto-action, and the critic's Q-values decide which candidate is executed.">
    <Defs id="sdn" />
    <Arrows id="sdn" />
    <Panel index={0} step="1 · PROTO-ACTION" note="â" sub={<>actor <Phi />(s)</>}>
      <Cloud />
      <Proto />
    </Panel>
    <Panel index={1} step="2 · NEIGHBORHOOD" note="B(â)" sub="L∞ ball of radius L">
      <Cloud faint />
      {inBall.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={2.6} className="fill-ink" opacity={0.6} />
      ))}
      <rect
        x={A.x - HALF}
        y={A.y - HALF}
        width={2 * HALF}
        height={2 * HALF}
        fill="none"
        className="stroke-ink"
        strokeDasharray="4 3"
        opacity={0.7}
      />
      <Proto />
    </Panel>
    <Panel index={2} step="3 · SAMPLE" note="{a′}" sub="K random draws, not all">
      <Cloud faint />
      {inBall.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={2.2} className="fill-ink" opacity={0.25} />
      ))}
      <rect
        x={A.x - HALF}
        y={A.y - HALF}
        width={2 * HALF}
        height={2 * HALF}
        fill="none"
        className="stroke-ink"
        strokeDasharray="4 3"
        opacity={0.35}
      />
      {SAMPLED.map((d, i) => (
        <g key={i}>
          <line x1={A.x} y1={A.y} x2={d.x} y2={d.y} className="stroke-accent" opacity={0.45} />
          <circle cx={d.x} cy={d.y} r={4} className="fill-accent" />
        </g>
      ))}
      <circle cx={A.x} cy={A.y} r={3} className="fill-ink" />
    </Panel>
    <Panel index={3} step="4 · EVALUATE" note="q(a′)" sub="critic Q(s, a′)">
      <line x1={24} y1={98} x2={130} y2={98} className="stroke-muted" />
      {[30, 62, 22, 44].map((h, i) => (
        <rect
          key={i}
          x={32 + i * 24}
          y={98 - h}
          width={14}
          height={h}
          rx={2}
          className={i === 1 ? "fill-accent" : "fill-muted"}
          opacity={i === 1 ? 1 : 0.5}
        />
      ))}
      <rect x={28} y={98 - 62 - 5} width={22} height={62 + 5} rx={3} fill="none" className="stroke-accent" strokeWidth={1.5} />
      <text x={39} y={22} textAnchor="middle" className="fill-accent font-mono" fontSize={9}>
        argmax
      </text>
    </Panel>
  </Scheme>
);

export const DbuScheme = () => {
  const perturbed = [
    { x: 22, y: -12 },
    { x: -18, y: 16 },
    { x: 8, y: 28 },
    { x: -30, y: -8 },
    { x: 30, y: 14 },
  ];
  const weights = [0.08, 0.44, 0.2, 0.04, 0.24];
  const heights = [30, 52, 40, 20, 46];
  return (
    <Scheme label="Scheme of Distance-Based Updates: the proto-action is perturbed into M candidate actions, the critic evaluates them, a softmax-weighted mean forms a target action, and the actor is regressed toward that target.">
      <Defs id="dbu" />
      <Arrows id="dbu" accent />
      <Panel index={0} step="1 · PROTO-ACTION" note="â" sub={<>actor <Phi />(s)</>}>
        <Cloud />
        <Proto />
      </Panel>
      <Panel index={1} step="2 · PERTURB" note="{a″}" sub={<>noise 𝒩(â, σ<Sub>b</Sub>)<Back />, rounded</>}>
        <Cloud faint />
        <circle cx={A.x} cy={A.y} r={18} fill="none" className="stroke-ink" strokeDasharray="3 3" opacity={0.35} />
        <circle cx={A.x} cy={A.y} r={36} fill="none" className="stroke-ink" strokeDasharray="3 3" opacity={0.25} />
        {perturbed.map((d, i) => (
          <g key={i}>
            <line x1={A.x} y1={A.y} x2={A.x + d.x} y2={A.y + d.y} className="stroke-accent" opacity={0.35} />
            <circle cx={A.x + d.x} cy={A.y + d.y} r={3.8} className="fill-accent" />
          </g>
        ))}
        <circle cx={A.x} cy={A.y} r={3} className="fill-ink" />
      </Panel>
      <Panel index={2} step="3 · EVALUATE" note="q(a″)" sub="critic Q(s, a″)">
        <text x={75} y={16} textAnchor="middle" className="fill-accent font-mono" fontSize={9}>
          weights ∝ exp(q/τ)
        </text>
        <line x1={20} y1={98} x2={132} y2={98} className="stroke-muted" />
        {heights.map((h, i) => (
          <rect
            key={i}
            x={26 + i * 21}
            y={98 - h}
            width={13}
            height={h}
            rx={2}
            className="fill-accent"
            opacity={0.2 + weights[i] * 1.7}
          />
        ))}
      </Panel>
      <Panel index={3} step="4 · TARGET" note="ā" sub="softmax-weighted mean">
        {perturbed.map((d, i) => (
          <circle key={i} cx={64 + d.x * 0.9} cy={64 + d.y * 0.9} r={2.6} className="fill-accent" opacity={0.25 + weights[i] * 1.2} />
        ))}
        <circle cx={46} cy={78} r={5} fill="none" className="stroke-ink" strokeWidth={1.5} />
        <circle cx={100} cy={44} r={5.5} className="fill-accent" />
        <line x1={52} y1={74} x2={93} y2={48} className="stroke-accent" strokeWidth={1.5} markerEnd="url(#dbu-acc)" />
        <text x={32} y={96} className="fill-ink font-serif" fontStyle="italic" fontSize={12}>
          â
        </text>
        <text x={106} y={34} className="fill-accent font-serif" fontStyle="italic" fontSize={12}>
          ā
        </text>
        <text x={75} y={108} textAnchor="middle" className="fill-muted font-serif" fontStyle="italic" fontSize={11}>
          loss ‖â − ā‖²
        </text>
      </Panel>
    </Scheme>
  );
};

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  children?: ReactNode;
  training?: boolean;
}

const Box = ({ x, y, w, h, title, children, training = false }: BoxProps) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      className={`fill-surface ${training ? "stroke-accent" : "stroke-ink"}`}
      strokeWidth={1.5}
      strokeDasharray={training ? "6 3" : undefined}
    />
    <text x={x + w / 2} y={y + 26} textAnchor="middle" className={`font-sans ${training ? "fill-accent" : "fill-ink"}`} fontSize={14} fontWeight={600}>
      {title}
    </text>
    {children}
  </g>
);

const Maths = ({ x, y, children, accent = false, size = 15 }: { x: number; y: number; children: ReactNode; accent?: boolean; size?: number }) => (
  <text x={x} y={y} textAnchor="middle" className={`font-serif ${accent ? "fill-accent" : "fill-ink"}`} fontStyle="italic" fontSize={size}>
    {children}
  </text>
);

const Line = ({ d, accent = false, id }: { d: string; accent?: boolean; id: string }) => (
  <path
    d={d}
    fill="none"
    className={accent ? "stroke-accent" : "stroke-muted"}
    strokeWidth={1.6}
    strokeDasharray={accent ? "6 3" : undefined}
    markerEnd={`url(#${id}-${accent ? "acc" : "ink"})`}
  />
);

const Small = ({ x, y, children, accent = false, anchor = "middle" }: { x: number; y: number; children: ReactNode; accent?: boolean; anchor?: "start" | "middle" }) => (
  <text x={x} y={y} textAnchor={anchor} className={`font-sans ${accent ? "fill-accent" : "fill-muted"}`} fontSize={12}>
    {children}
  </text>
);

export const MarlScheme = () => (
  <div className="overflow-x-auto">
    <svg
      role="img"
      aria-label="Scheme of the two-stage algorithm. The environment passes the state to one actor and post-processing per vehicle-request agent, which output scores. A central bipartite matching turns the scores into the global action. In training only, a critic learns from the global reward, a counterfactual advantage is computed, and the actor loss updates the actor."
      viewBox="0 0 760 346"
      className="h-auto w-full min-w-[680px]"
    >
      <Defs id="marl" />

      {/* inference path */}
      <Box x={6} y={66} w={108} h={72} title="Environment">
        <Maths x={60} y={114}>state s</Maths>
      </Box>
      <Line id="marl" d="M114,102 L148,102" />

      <rect x={148} y={30} width={340} height={152} rx={10} fill="none" className="stroke-line" strokeDasharray="2 4" />
      <text x={160} y={49} className="fill-accent font-mono" fontSize={10} letterSpacing="0.1em">
        STAGE 1 · ONE AGENT PER VEHICLE–REQUEST PAIR
      </text>
      {[2, 1].map((k) => (
        <g key={k}>
          <rect x={164 + k * 7} y={84 - k * 7} width={140} height={72} rx={8} className="fill-surface stroke-line" />
          <rect x={340 + k * 7} y={84 - k * 7} width={132} height={72} rx={8} className="fill-surface stroke-line" />
        </g>
      ))}
      <Box x={164} y={84} w={140} h={72} title="Actor">
        <Maths x={234} y={140}>π<tspan dy="3" fontSize="10">φ</tspan><tspan dy="-3">(a</tspan><tspan dy="3" fontSize="10">i</tspan><tspan dy="-3"> | s, i)</tspan></Maths>
      </Box>
      <Line id="marl" d="M304,120 L340,120" />
      <Box x={340} y={84} w={132} h={72} title="Post-processing">
        <Small x={406} y={126}>sample / argmax</Small>
        <Small x={406} y={143}>→ score</Small>
      </Box>

      <Line id="marl" d="M488,102 L544,102" />
      <Small x={516} y={94}>scores</Small>
      <Box x={544} y={66} w={140} h={72} title="Matching">
        <Maths x={614} y={110}>max Σ scores</Maths>
        <Small x={614} y={128}>bipartite, one-to-one</Small>
      </Box>

      {/* the global action returns to the environment */}
      <Line id="marl" d="M684,102 L726,102 L726,20 L60,20 L60,66" />
      <Maths x={390} y={14} size={14}>global action ā</Maths>

      {/* training only */}
      <Line id="marl" accent d="M60,138 L60,268 L148,268" />
      <Small x={70} y={216} accent anchor="start">global reward r</Small>
      <Box training x={148} y={232} w={172} h={72} title="Critic">
        <Maths accent x={234} y={282}>Q<tspan dy="3" fontSize="10">θ</tspan><tspan dy="-3">(a</tspan><tspan dy="3" fontSize="10">i</tspan><tspan dy="-3"> | s, ā</tspan><tspan dy="3" fontSize="10">−i</tspan><tspan dy="-3">)</tspan></Maths>
      </Box>
      <Line id="marl" accent d="M320,268 L352,268" />
      <Box training x={352} y={232} w={196} h={72} title="Counterfactual advantage">
        <Maths accent x={450} y={282} size={14}>A<tspan dy="3" fontSize="10">i</tspan><tspan dy="-3"> = Q(a</tspan><tspan dy="3" fontSize="10">i</tspan><tspan dy="-3">) − baseline</tspan></Maths>
      </Box>
      <Line id="marl" accent d="M548,268 L580,268" />
      <Box training x={580} y={232} w={150} h={72} title="Actor loss">
        <Maths accent x={655} y={282}>J<tspan dy="3" fontSize="10">π</tspan><tspan dy="-3">(φ | s, i)</tspan></Maths>
      </Box>
      <Line id="marl" accent d="M655,232 L655,208 L234,208 L234,158" />
      <Small x={444} y={201} accent>update φ</Small>

      <text x={6} y={336} className="fill-muted font-mono" fontSize={10.5}>
        Solid: inference and training · Dashed (accent): training only
      </text>
    </svg>
  </div>
);
