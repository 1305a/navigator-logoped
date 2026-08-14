import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

export function TrainerCompletionOverlay({
  variant,
}: {
  variant: "correct" | "incorrect" | null;
}) {
  if (!variant) return null;
  const isCorrect = variant === "correct";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className={cn(
          "flex size-24 items-center justify-center rounded-full text-white",
          isCorrect ? "bg-emerald-500" : "bg-destructive",
        )}
      >
        {isCorrect ? <CheckCircle2 className="size-12" /> : <XCircle className="size-12" />}
      </div>
    </div>
  );
}
