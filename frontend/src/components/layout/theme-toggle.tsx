"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <Button size="icon" variant="ghost" onClick={toggleTheme} aria-label="Alternar tema">
      <Icon className="h-5 w-5" />
    </Button>
  );
}
