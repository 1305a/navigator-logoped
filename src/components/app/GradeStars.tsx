import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function GradeStars({
  value,
  onChange,
  size = "md",
}: {
  value: number | null;
  onChange?: (grade: number) => void;
  size?: "sm" | "md";
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = !!onChange;
  const starSize = size === "sm" ? "size-3.5" : "size-5";
  const activeCount = hovered ?? value ?? 0;

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= activeCount;
        const star = (
          <Star
            className={cn(
              starSize,
              filled ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/40",
            )}
          />
        );
        if (!interactive) {
          return <span key={n}>{star}</span>;
        }
        return (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onClick={() => onChange(n)}
            className="transition-transform hover:scale-110"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
