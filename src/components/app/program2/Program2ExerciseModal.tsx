import { useEffect, useState } from "react";
import type { Exercise, Program2Exercise } from "@/data/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradeStars } from "@/components/app/GradeStars";
import { CheckCircle2, Play, Timer } from "lucide-react";

type Stage = "idle" | "in-progress" | "rating" | "done";

function randomRating() {
  return 3 + Math.floor(Math.random() * 3);
}

const ratingLabels: { key: keyof Program2Exercise["ratings"]; label: string }[] = [
  { key: "accuracy", label: "Точность выполнения" },
  { key: "independence", label: "Самостоятельность" },
  { key: "pace", label: "Темп выполнения" },
];

export function Program2ExerciseModal({
  open,
  onOpenChange,
  exercise,
  entry,
  location,
  readOnly = false,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: Exercise | undefined;
  entry: Program2Exercise | undefined;
  location: "home" | "room" | null;
  readOnly?: boolean;
  onComplete?: (ratings: Program2Exercise["ratings"], autoGraded: boolean) => void;
}) {
  const [stage, setStage] = useState<Stage>("idle");
  const [draft, setDraft] = useState<Program2Exercise["ratings"]>({
    accuracy: null,
    independence: null,
    pace: null,
  });
  const [finalRatings, setFinalRatings] = useState<Program2Exercise["ratings"]>({
    accuracy: null,
    independence: null,
    pace: null,
  });
  const [finalAutoGraded, setFinalAutoGraded] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStage(entry?.done ? "done" : "idle");
    setDraft({ accuracy: null, independence: null, pace: null });
    setFinalRatings(entry?.ratings ?? { accuracy: null, independence: null, pace: null });
    setFinalAutoGraded(entry?.autoGraded ?? false);
  }, [open, entry]);

  if (!exercise) return null;

  function handleStart() {
    setStage("in-progress");
  }

  function handleFinish() {
    if (location === "home") {
      const ratings = {
        accuracy: randomRating(),
        independence: randomRating(),
        pace: randomRating(),
      };
      onComplete?.(ratings, true);
      setFinalRatings(ratings);
      setFinalAutoGraded(true);
      setStage("done");
      return;
    }
    setStage("rating");
  }

  function handleSaveRating() {
    if (draft.accuracy === null || draft.independence === null || draft.pace === null) return;
    onComplete?.(draft, false);
    setFinalRatings(draft);
    setFinalAutoGraded(false);
    setStage("done");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{exercise.title}</DialogTitle>
          <DialogDescription>{exercise.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="size-4" /> Продолжительность: {exercise.duration}
          </div>

          {!readOnly && stage === "idle" && (
            <Button onClick={handleStart} className="w-fit gap-1.5">
              <Play className="size-4" /> Начать задание
            </Button>
          )}

          {stage === "in-progress" && (
            <div className="flex flex-col items-center gap-3 rounded-lg border bg-accent/40 p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Play className="size-6" />
              </div>
              <p className="text-sm font-medium text-foreground">Задание выполняется…</p>
              <Button size="sm" variant="outline" onClick={handleFinish}>
                Завершить
              </Button>
            </div>
          )}

          {stage === "rating" && (
            <div className="flex flex-col gap-3 rounded-lg border p-4">
              <p className="text-sm font-medium text-foreground">Оценка выполнения</p>
              {ratingLabels.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <GradeStars
                    value={draft[key]}
                    size="sm"
                    onChange={(v) => setDraft((prev) => ({ ...prev, [key]: v }))}
                  />
                </div>
              ))}
              <Button
                size="sm"
                className="mt-1 w-fit gap-1.5"
                disabled={draft.accuracy === null || draft.independence === null || draft.pace === null}
                onClick={handleSaveRating}
              >
                Сохранить оценку
              </Button>
            </div>
          )}

          {stage === "done" && (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle2 className="size-4 text-primary" /> Выполнено
                {finalAutoGraded && (
                  <Badge variant="secondary" className="ml-1">
                    Оценка проставлена автоматически
                  </Badge>
                )}
              </div>
              {ratingLabels.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <GradeStars value={finalRatings[key]} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
