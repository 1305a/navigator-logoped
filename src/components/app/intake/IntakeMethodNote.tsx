import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentMethodNote } from "@/lib/intake";
import type { IntakeAge } from "@/data/intake";
import type { IntakeState } from "@/data/types";

export function IntakeMethodNote({ age, intake }: { age: IntakeAge; intake: IntakeState }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const text = currentMethodNote(age, intake);

  useEffect(() => {
    setOpen(false);
  }, [intake]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  if (!text) return null;

  return (
    <div ref={rootRef} className="absolute bottom-3.5 right-3.5">
      {open && (
        <div className="absolute bottom-10 right-0 w-72 rounded-lg border bg-popover p-3.5 text-popover-foreground shadow-lg">
          <p className="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-primary">
            Методология этапа
          </p>
          <p className="text-xs leading-relaxed text-foreground/80">{text}</p>
        </div>
      )}
      <button
        type="button"
        title="По какой методологии сделан этот этап"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex size-7 items-center justify-center rounded-full border text-muted-foreground transition-colors",
          open ? "border-primary bg-primary text-primary-foreground" : "bg-muted hover:bg-accent",
        )}
      >
        <Info className="size-3.5" />
      </button>
    </div>
  );
}
