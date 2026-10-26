import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

/** Native <details> styled to match the cards; collapsed by default. */
const Disclosure = ({ title, children }: { title: string; children: ReactNode }) => (
  <details className="group mt-4 rounded-lg border border-line">
    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm text-muted transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
      <span>{title}</span>
      <ChevronDown size={15} className="transition-transform group-open:rotate-180" />
    </summary>
    <div className="px-4 pb-4">{children}</div>
  </details>
);

export default Disclosure;
