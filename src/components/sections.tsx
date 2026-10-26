import { ArrowUpRight, Download, GraduationCap, Mail } from "lucide-react";
import {
  education,
  experience,
  honors,
  links,
  news,
  profile,
  publications,
  skills,
  stats,
  themes,
  volunteering,
  type Entry,
  type Publication,
} from "@/content/data";
import Disclosure from "./Disclosure";
import { ActionSpaceFigure, FleetFigure, PolytopeFigure } from "./figures/Figures";
import { DbuScheme, MarlScheme, SdnScheme } from "./schemes/Schemes";
import Reveal from "./Reveal";
import Rich from "./Rich";
import Section from "./Section";
import { GithubIcon, LinkedinIcon } from "./Icons";

export const About = () => (
  <Section id="about" index="01 — About" title="Reinforcement learning for decisions at scale">
    <div className="space-y-4 text-[17px] leading-relaxed text-ink/85">
      {profile.bio.map((p) => (
        <p key={p}>
          <Rich>{p}</Rich>
        </p>
      ))}
    </div>

    <div className="mt-8 flex flex-wrap gap-3">
      <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
        <Download size={16} /> Download CV
      </a>
      <a href={`mailto:${profile.email}`} className="btn">
        <Mail size={16} /> Get in touch
      </a>
      <a href={links.scholar} target="_blank" rel="noopener noreferrer" className="btn">
        <GraduationCap size={16} /> Google Scholar
      </a>
      <a href={links.github} target="_blank" rel="noopener noreferrer" className="btn">
        <GithubIcon size={16} /> GitHub
      </a>
      <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
        <LinkedinIcon size={16} /> LinkedIn
      </a>
    </div>

    <dl className="mt-10 grid grid-cols-2 gap-y-6 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="font-serif text-3xl font-semibold text-accent"><Rich>{s.value}</Rich></dt>
          <dd className="mt-1 max-w-[11rem] text-xs leading-snug text-muted">{s.label}</dd>
        </div>
      ))}
    </dl>

    <h3 className="mt-14 section-label">Research themes</h3>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {themes.map((t) => (
        <Reveal key={t.title}>
          <div className="h-full rounded-lg border border-line bg-surface/60 p-5 transition-colors hover:border-accent/50">
            <h4 className="font-serif text-lg font-semibold leading-snug">{t.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted"><Rich>{t.text}</Rich></p>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);

export const News = () => (
  <Section id="news" index="02 — News" title="Recently">
    <ul className="divide-y divide-line border-y border-line">
      {news.map((n) => (
        <li key={n.date + n.text} className="grid gap-1 py-3 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
          <span className="font-mono text-xs text-accent sm:pt-0.5">{n.date}</span>
          <span className="text-[15px] leading-relaxed text-ink/85">
            {n.text}
            {n.link && (
              <>
                {" "}
                <a href={n.link.href} target="_blank" rel="noopener noreferrer" className="link whitespace-nowrap font-medium text-accent">
                  {n.link.label} →
                </a>
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  </Section>
);

const Authors = ({ authors }: { authors: string[] }) => (
  <p className="mt-2 text-sm leading-relaxed text-muted">
    {authors.map((a, i) => (
      <span key={a}>
        {a === profile.name ? (
          <span className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4">{a}</span>
        ) : (
          a
        )}
        {i < authors.length - 1 ? ", " : ""}
      </span>
    ))}
  </p>
);

const PublicationCard = ({ pub }: { pub: Publication }) => (
  <Reveal>
    <article className="rounded-lg border border-line p-6 transition-colors hover:border-accent/50">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">{pub.venue}</span>
        <span className="font-mono text-xs text-muted"><Rich>{pub.highlight}</Rich></span>
      </div>
      <h3 className="mt-3 text-xl font-semibold leading-snug">{pub.title}</h3>
      <Authors authors={pub.authors} />
      <p className="mt-4 text-sm leading-relaxed text-ink/80">{pub.summary}</p>
      {pub.figure === "action-space" && <ActionSpaceFigure />}
      {pub.figure === "polytope" && <PolytopeFigure />}
      {pub.figure === "fleet" && <FleetFigure />}
      {pub.scheme?.kind === "dgrl" && (
        <Disclosure title={pub.scheme.title}>
          <div className="space-y-6">
            <figure>
              <SdnScheme />
              <figcaption className="mt-2 font-mono text-[11px] leading-relaxed text-muted">
                Sampled Dynamic Neighborhood (SDN) picks the action: the proto-action defines a neighborhood, K
                candidates are drawn from it based on their distance to the proto-action, and the critic's Q-values decide. During training, one of the
                candidates is sampled instead of taking the maximum.
              </figcaption>
            </figure>
            <figure>
              <DbuScheme />
              <figcaption className="mt-2 font-mono text-[11px] leading-relaxed text-muted">
                Distance-Based Updates (DBU) train the actor: perturbed candidates are scored by the critic and
                combined into a target action, and the policy update becomes a regression toward it.
              </figcaption>
            </figure>
          </div>
        </Disclosure>
      )}
      {pub.scheme?.kind === "marl" && (
        <Disclosure title={pub.scheme.title}>
          <figure>
            <MarlScheme />
            <figcaption className="mt-2 font-mono text-[11px] leading-relaxed text-muted">
              Two-stage algorithm: per-agent actors propose scores, a central matching turns them into the global
              action. In training, a critic learns from the global reward and a counterfactual advantage gives each
              agent credit for its own contribution.
            </figcaption>
          </figure>
        </Disclosure>
      )}
      {pub.schematics && (
        <Disclosure title={pub.schematics.title}>
          <div className="space-y-5">
            {pub.schematics.figures.map((f) => (
              <figure key={f.src}>
                {/* The source figures have white backgrounds and fixed colors, so they keep a white panel in dark mode. */}
                <div className="rounded-md bg-white p-3">
                  <img src={f.src} alt={f.alt} width={f.width} height={f.height} loading="lazy" className="h-auto w-full" />
                </div>
                <figcaption className="mt-2 font-mono text-[11px] leading-relaxed text-muted">{f.caption}</figcaption>
              </figure>
            ))}
          </div>
        </Disclosure>
      )}
      {pub.blogNote && (
        <p className="mt-4 text-sm text-muted">
          {pub.blogNote.text}{" "}
          <a href={pub.blogNote.href} target="_blank" rel="noopener noreferrer" className="link font-medium text-accent">
            {pub.blogNote.label} →
          </a>
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {pub.tags.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
        <span className="flex-1" />
        {pub.links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-accent/40 px-3 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/10"
          >
            {l.label} <ArrowUpRight size={12} />
          </a>
        ))}
      </div>
    </article>
  </Reveal>
);

export const Publications = () => (
  <Section id="publications" index="03 — Publications" title="Selected publications">
    <div className="grid gap-6">
      {publications.map((p) => (
        <PublicationCard key={p.title} pub={p} />
      ))}
    </div>
    <p className="mt-6 text-sm text-muted">
      The full list is on{" "}
      <a href={links.scholar} target="_blank" rel="noopener noreferrer" className="link text-ink">
        Google Scholar
      </a>
      .
    </p>
  </Section>
);

const Timeline = ({ entries }: { entries: Entry[] }) => (
  <ol className="relative ml-1.5 border-l border-line">
    {entries.map((e) => (
      <li key={e.org + e.period} className="relative pb-9 pl-7 last:pb-0">
        <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg" />
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-lg font-semibold leading-snug">
              {e.orgHref ? (
                <a href={e.orgHref} target="_blank" rel="noopener noreferrer" className="link">
                  {e.org}
                </a>
              ) : (
                e.org
              )}
            </h3>
            <span className="font-mono text-xs text-muted">{e.period}</span>
          </div>
          <p className="mt-0.5 text-sm italic text-muted">{e.role}</p>
          {e.points && (
            <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-ink/80">
              {e.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-2.5 h-px w-3 shrink-0 bg-accent" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </li>
    ))}
  </ol>
);

export const Experience = () => (
  <Section id="experience" index="04 — Experience" title="Experience">
    <Timeline entries={experience} />
  </Section>
);

export const Education = () => (
  <Section id="education" index="05 — Education" title="Education">
    <Timeline entries={education} />
  </Section>
);

export const Volunteering = () => (
  <Section id="volunteering" index="06 — Volunteering" title="Volunteering">
    <Timeline entries={volunteering} />
  </Section>
);

export const Honors = () => (
  <Section id="honors" index="07 — Honors & Skills" title="Honors & skills">
    <h3 className="section-label">Scholarships</h3>
    <dl className="mt-4 divide-y divide-line border-y border-line">
      {honors.map((h) => (
        <div key={h.title} className="grid gap-1 py-3 sm:grid-cols-[13rem_1fr] sm:gap-4">
          <dt>
            <span className="text-sm font-medium">{h.title}</span>
            <span className="mt-0.5 block font-mono text-xs text-muted">{h.date}</span>
          </dt>
          <dd className="text-sm text-muted">{h.text}</dd>
        </div>
      ))}
    </dl>

    <h3 className="mt-10 section-label">Tools</h3>
    <div className="mt-4 space-y-4">
      {skills.map((s) => (
        <div key={s.label} className="grid gap-2 sm:grid-cols-[13rem_1fr] sm:gap-4">
          <p className="text-sm font-medium">{s.label}</p>
          <div className="flex flex-wrap gap-2">
            {s.items.map((i) => (
              <span key={i} className="chip">
                {i}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </Section>
);

export const Contact = () => (
  <Section id="contact" index="08 — Contact" title="Get in touch">
    <p className="max-w-xl text-[17px] leading-relaxed text-ink/85">
      I'm happy to talk about reinforcement learning, optimization and applications in mobility and
      logistics, and about research collaborations. The easiest way to reach me is by email.
    </p>
    <div className="mt-6 flex flex-wrap gap-3">
      <a href={`mailto:${profile.email}`} className="btn btn-solid">
        <Mail size={16} /> {profile.email}
      </a>
      <a href={links.github} target="_blank" rel="noopener noreferrer" className="btn">
        <GithubIcon size={16} /> GitHub
      </a>
      <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
        <LinkedinIcon size={16} /> LinkedIn
      </a>
    </div>
  </Section>
);
