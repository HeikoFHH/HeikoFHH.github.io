import { useState } from "react";
import { FileText, GraduationCap, Mail, Menu, X } from "lucide-react";
import { links, profile } from "@/content/data";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { GithubIcon, LinkedinIcon } from "./Icons";
import ThemeSwitch from "./ThemeSwitch";

export const navItems = [
  { id: "about", label: "About" },
  { id: "news", label: "News" },
  { id: "publications", label: "Publications" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "volunteering", label: "Volunteering" },
  { id: "honors", label: "Honors & Skills" },
  { id: "contact", label: "Contact" },
];

const ids = navItems.map((n) => n.id);

const socials = [
  { label: "Email", href: `mailto:${profile.email}`, icon: <Mail size={17} /> },
  { label: "CV (PDF)", href: profile.cv, icon: <FileText size={17} />, newTab: true },
  { label: "Google Scholar", href: links.scholar, icon: <GraduationCap size={18} /> },
  { label: "GitHub", href: links.github, icon: <GithubIcon size={17} /> },
  { label: "LinkedIn", href: links.linkedin, icon: <LinkedinIcon size={17} /> },
];

const IconRow = () => (
  <div className="flex items-center gap-1">
    {socials.map((s) => (
      <a
        key={s.label}
        href={s.href}
        target={s.newTab || s.href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        aria-label={s.label}
        title={s.label}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-accent/10 hover:text-accent"
      >
        {s.icon}
      </a>
    ))}
  </div>
);

/** Desktop: sticky left rail. Mobile: slim top bar with a dropdown. */
const Rail = () => {
  const active = useScrollSpy(ids);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 hidden w-80 flex-col border-r border-line px-10 py-10 lg:flex">
        <a href="#about" className="mx-auto block w-40" aria-label="Back to top">
          <div className="photo-arch">
            <img src={profile.photo} alt="Portrait of Heiko Hoppe" width={160} height={200} />
          </div>
        </a>

        <div className="mt-8">
          <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="mt-1 text-sm text-muted">{profile.role}</p>
          <ul className="mt-3 space-y-0.5 text-sm text-muted">
            {profile.affiliations.map((a) => (
              <li key={a.org}>
                {a.detail},{" "}
                <a href={a.href} target="_blank" rel="noopener noreferrer" className="link text-ink">
                  {a.org}
                </a>
              </li>
            ))}
          </ul>
          <div className="-ml-2 mt-3">
            <IconRow />
          </div>
        </div>

        <nav className="mt-6 flex-1" aria-label="Sections">
          <ul className="space-y-1">
            {navItems.map((n, i) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? "true" : undefined}
                  className={`group flex items-center gap-3 py-1 text-sm transition-colors ${
                    active === n.id ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  <span className="font-mono text-[10px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={`h-px bg-accent transition-all ${active === n.id ? "w-8" : "w-3 group-hover:w-5"}`}
                  />
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </aside>

      {/* Desktop: light/dark switch pinned to the top right */}
      <div className="fixed right-6 top-5 z-40 hidden lg:block">
        <ThemeSwitch />
      </div>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <a href="#about" className="font-serif text-lg font-semibold tracking-tight">
            {profile.name}
          </a>
          <div className="flex items-center gap-1">
            <ThemeSwitch />
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-accent"
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-line bg-bg px-4 pb-4 pt-2">
            <nav className="mx-auto grid max-w-3xl grid-cols-2 gap-x-4" aria-label="Sections">
              {navItems.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className={`border-b border-line/60 py-2.5 text-sm ${
                    active === n.id ? "text-accent" : "text-muted"
                  }`}
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="mx-auto mt-3 max-w-3xl">
              <IconRow />
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Rail;
