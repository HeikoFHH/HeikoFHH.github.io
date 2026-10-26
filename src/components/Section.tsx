import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
}

const Section = ({ id, index, title, children }: SectionProps) => (
  <section id={id} className="border-t border-line py-14 first-of-type:border-t-0 first-of-type:pt-0">
    <p className="section-label">{index}</p>
    <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
    <div className="mt-8">{children}</div>
  </section>
);

export default Section;
