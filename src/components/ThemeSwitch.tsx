import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

/** Light/dark switch with a sliding knob; the knob sits under the active mode's icon. */
const ThemeSwitch = () => {
  const { dark, toggle } = useTheme();
  return (
    <button
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className="relative flex h-9 w-[4.5rem] items-center justify-between rounded-full border border-line bg-surface p-1 shadow-sm transition-colors hover:border-accent"
    >
      <span
        aria-hidden
        className={`absolute left-1 top-1 h-7 w-7 rounded-full bg-accent transition-transform duration-300 ${
          dark ? "translate-x-[34px]" : "translate-x-0"
        }`}
      />
      <span className={`relative flex h-7 w-7 items-center justify-center ${dark ? "text-muted" : "text-bg"}`}>
        <Sun size={15} />
      </span>
      <span className={`relative flex h-7 w-7 items-center justify-center ${dark ? "text-bg" : "text-muted"}`}>
        <Moon size={15} />
      </span>
    </button>
  );
};

export default ThemeSwitch;
