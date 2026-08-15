import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { letterSearchTasks, buildTargetIndexes } from "@/data/letterSearchTrainer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrainerStatsBar } from "@/components/app/TrainerStatsBar";
import { TrainerAdvanceButton } from "@/components/app/TrainerAdvanceButton";
import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

type RowStatus = "idle" | "done" | "error";

export default function LetterSearchTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = letterSearchTasks[taskIndex];
  const rowModels = useMemo(
    () => task.rows.map((r) => ({ letters: Array.from(r.letters), target: buildTargetIndexes(r.letters, r.words) })),
    [task],
  );

  const [activeRow, setActiveRow] = useState(0);
  const [selections, setSelections] = useState<Array<Set<number>>>([]);
  const [rowStatus, setRowStatus] = useState<RowStatus[]>([]);
  const [taskCompleted, setTaskCompleted] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    setActiveRow(0);
    setSelections(rowModels.map(() => new Set()));
    setRowStatus(rowModels.map(() => "idle"));
    setTaskCompleted(false);
  }, [taskIndex, rowModels]);

  const isLast = taskIndex === letterSearchTasks.length - 1;

  function toggleLetter(rowIdx: number, letterIdx: number) {
    if (rowIdx !== activeRow || rowStatus[rowIdx] === "done") return;
    setSelections((prev) => {
      const next = [...prev];
      const set = new Set(next[rowIdx]);
      if (set.has(letterIdx)) set.delete(letterIdx);
      else set.add(letterIdx);
      next[rowIdx] = set;
      return next;
    });
  }

  function handleDone(rowIdx: number) {
    if (rowIdx !== activeRow || rowStatus[rowIdx] === "done") return;
    const model = rowModels[rowIdx];
    const selected = selections[rowIdx];
    const correct = selected.size === model.target.size && [...model.target].every((i) => selected.has(i));

    if (!correct) {
      setIncorrectCount((c) => c + 1);
      setRowStatus((prev) => prev.map((s, i) => (i === rowIdx ? "error" : s)));
      window.setTimeout(() => {
        setRowStatus((prev) => prev.map((s, i) => (i === rowIdx ? "idle" : s)));
      }, 500);
      return;
    }

    setCorrectCount((c) => c + 1);
    setRowStatus((prev) => prev.map((s, i) => (i === rowIdx ? "done" : s)));

    if (rowIdx < rowModels.length - 1) {
      setActiveRow(rowIdx + 1);
    } else {
      window.setTimeout(() => setTaskCompleted(true), 350);
    }
  }

  function handleNextTask() {
    if (!taskCompleted || isLast) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-1 gap-1.5"
          render={<Link to="/logoped/exercise-bank" />}
        >
          <ArrowLeft className="size-4" /> Банк упражнений
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">
          Найдите слова на букву М среди букв
        </h1>
        <p className="text-sm text-muted-foreground">Выберите буквы слова и нажмите «Готово»</p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(taskIndex)} onValueChange={(v) => v && setTaskIndex(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(task.id)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {letterSearchTasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {letterSearchTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-col gap-1.5">
        {rowModels.map((row, rowIdx) => {
          const status = rowStatus[rowIdx] ?? "idle";
          const isActive = rowIdx === activeRow;
          const isBlocked = !isActive || status === "done";
          return (
            <div
              key={rowIdx}
              className={cn(
                "flex items-center justify-between gap-2 rounded-xl border-2 px-3 py-1.5",
                status === "done" && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                status === "error" && "border-destructive bg-destructive/10",
                status === "idle" && "border-border bg-card",
                !isActive && status !== "done" && "opacity-40",
              )}
            >
              <div className="flex flex-nowrap items-center gap-1 overflow-x-auto">
                {row.letters.map((letter, letterIdx) => {
                  const selected = selections[rowIdx]?.has(letterIdx) ?? false;
                  return (
                    <button
                      key={letterIdx}
                      type="button"
                      onClick={() => toggleLetter(rowIdx, letterIdx)}
                      disabled={isBlocked}
                      className={cn(
                        "size-8 shrink-0 rounded-lg border-2 text-sm font-bold",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/50",
                      )}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
              <Button
                type="button"
                size="sm"
                variant={isActive && status !== "done" ? "default" : "secondary"}
                disabled={!isActive || status === "done"}
                onClick={() => handleDone(rowIdx)}
              >
                ✓ Готово
              </Button>
            </div>
          );
        })}
      </div>

      {taskCompleted && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextTask} onFinish={handleFinish} />
      )}
    </div>
  );
}
