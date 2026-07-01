import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "intech:theme";

function getInitial(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(KEY) as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Hook de tema claro/escuro com persistência e respeito ao sistema. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(KEY, theme);
    const t = setTimeout(() => root.classList.remove("theme-transition"), 500);
    return () => clearTimeout(t);
  }, [theme]);

  const toggle = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggle, setTheme };
}
