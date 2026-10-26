import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** Shared shell for the Impressum and Privacy pages. */
const LegalPage = ({ title, children }: { title: string; children: ReactNode }) => (
  <main className="min-h-screen px-6 py-16 md:px-12">
    <div className="mx-auto max-w-3xl">
      <Link to="/" className="mb-6 inline-block text-sm text-accent hover:underline">
        ← Back to Home
      </Link>
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">{title}</h1>
      <div className="space-y-6 leading-relaxed text-ink/80">{children}</div>
    </div>
  </main>
);

export const LegalSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-2">
    <h2 className="text-xl font-semibold text-ink">{title}</h2>
    {children}
  </section>
);

export default LegalPage;
