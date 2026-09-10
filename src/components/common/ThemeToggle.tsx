import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
  onNavigate?: () => void;
}

export function ThemeToggle({ showLabel = false, className, onNavigate }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleClick = () => {
    toggleTheme();
    onNavigate?.();
  };

  return (
    <Button
      variant="ghost"
      size={showLabel ? "default" : "icon"}
      onClick={handleClick}
      className={cn(
        "relative rounded-lg transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        showLabel && "w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-muted-foreground",
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative flex size-4.5 items-center justify-center">
        <Sun
          aria-hidden="true"
          className={cn(
            "size-4 transition-all duration-300",
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100 text-amber-500"
          )}
        />
        <Moon
          aria-hidden="true"
          className={cn(
            "absolute size-4 transition-all duration-300",
            isDark ? "rotate-0 scale-100 opacity-100 text-palette-peach" : "-rotate-90 scale-0 opacity-0"
          )}
        />
      </div>
      {showLabel && (
        <span className="flex-1 text-left">
          {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </span>
      )}
    </Button>
  );
}
