import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTrainerTime } from "@/lib/trainer";
import { CheckCircle2, Timer, XCircle } from "lucide-react";

export function TrainerStatsBar({
  controls,
  correctCount,
  incorrectCount,
  elapsedSeconds,
  onFinish,
}: {
  controls: ReactNode;
  correctCount: number;
  incorrectCount: number;
  elapsedSeconds: number;
  onFinish: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
        <div className="flex flex-wrap items-center gap-3">{controls}</div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" /> {correctCount}
          </span>
          <span className="flex items-center gap-1 font-medium text-destructive">
            <XCircle className="size-4" /> {incorrectCount}
          </span>
          <span className="flex items-center gap-1 font-mono text-muted-foreground">
            <Timer className="size-4" /> {formatTrainerTime(elapsedSeconds)}
          </span>
          <Button variant="outline" size="sm" onClick={onFinish}>
            Завершить тренажёр
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
