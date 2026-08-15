import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verbPictureLevels } from "@/data/verbToPictureTrainer";
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
import { TrainerCompletionOverlay } from "@/components/app/TrainerCompletionOverlay";
import { TrainerAdvanceButton } from "@/components/app/TrainerAdvanceButton";
import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";
import { shuffleArray } from "@/lib/trainer";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function VerbToPictureTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [levelIndex, setLevelIndex] = useState(0);
  const level = verbPictureLevels[levelIndex];
  const [taskIndex, setTaskIndex] = useState(0);
  const task = level.tasks[taskIndex];

  const [bank, setBank] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Array<string | null>>([]);
  const [locked, setLocked] = useState<boolean[]>([]);
  const [checkResult, setCheckResult] = useState<Array<"correct" | "incorrect" | null>>([]);
  const [attempt, setAttempt] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    setBank(shuffleArray(task.items.map((i) => i.correctVerb)));
    setSelectedWord(null);
    setPlaced(task.items.map(() => null));
    setLocked(task.items.map(() => false));
    setCheckResult(task.items.map(() => null));
    setAttempt(0);
    setIsChecking(false);
    setReadyToProceed(false);
    setFeedback(null);
  }, [levelIndex, taskIndex, task]);

  useEffect(() => {
    setTaskIndex(0);
  }, [levelIndex]);

  const isLast = taskIndex === level.tasks.length - 1;
  const allFilled = useMemo(() => placed.every((p, i) => locked[i] || p), [placed, locked]);

  function validate() {
    if (!allFilled || isChecking || readyToProceed) return;
    setIsChecking(true);

    const norm = (s: string | null) => String(s ?? "").trim().toLowerCase();
    const results = task.items.map((item, idx) =>
      locked[idx] ? true : norm(placed[idx]) === norm(item.correctVerb),
    );
    const newlyCorrect = results.filter((r, idx) => r && !locked[idx]).length;
    setCheckResult(results.map((r) => (r ? "correct" : "incorrect")));
    setCorrectCount((c) => c + newlyCorrect);

    if (results.every(Boolean)) {
      setLocked(results);
      setFeedback("correct");
      window.setTimeout(() => setFeedback(null), 900);
      window.setTimeout(() => {
        setIsChecking(false);
        setReadyToProceed(true);
      }, 900);
      return;
    }

    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);

    if (nextAttempt === 1) {
      setIncorrectCount((c) => c + 1);
      window.setTimeout(() => {
        const nextLocked = results.map((r, idx) => (r ? true : locked[idx]));
        setLocked(nextLocked);
        setPlaced((prev) => prev.map((p, idx) => (nextLocked[idx] ? p : null)));
        setCheckResult(task.items.map(() => null));
        setBank(shuffleArray(task.items.filter((_, idx) => !nextLocked[idx]).map((i) => i.correctVerb)));
        setSelectedWord(null);
        setIsChecking(false);
      }, 1000);
      return;
    }

    window.setTimeout(() => {
      setLocked(results.map((r, idx) => r || locked[idx]));
      setIsChecking(false);
      setReadyToProceed(true);
    }, 900);
  }

  useEffect(() => {
    if (!allFilled || isChecking || readyToProceed) return;
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFilled, isChecking, readyToProceed]);

  function onPickWord(w: string) {
    if (isChecking || readyToProceed) return;
    setSelectedWord((s) => (s === w ? null : w));
  }

  function onSlotClick(idx: number) {
    if (isChecking || readyToProceed || locked[idx]) return;
    if (placed[idx]) {
      const w = placed[idx]!;
      setPlaced((prev) => prev.map((p, i) => (i === idx ? null : p)));
      setBank((b) => shuffleArray([...b, w]));
      setCheckResult((prev) => prev.map((c, i) => (i === idx ? null : c)));
      return;
    }
    if (!selectedWord) return;
    setPlaced((prev) => prev.map((p, i) => (i === idx ? selectedWord : p)));
    setBank((b) => b.filter((w) => w !== selectedWord));
    setSelectedWord(null);
    setCheckResult((prev) => prev.map((c, i) => (i === idx ? null : c)));
  }

  function handleNextTask() {
    if (isChecking || !readyToProceed || isLast) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  const gridCols = task.items.length === 6 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-1 gap-1.5"
          render={<Link to="/logoped/exercise-bank" />}
        >
          <ArrowLeft className="size-4" /> Банк упражнений
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Подбери глагол</h1>
        <p className="text-sm text-muted-foreground">Вставьте подходящий глагол в предложение по картинке</p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Уровень</Label>
            <Select value={String(levelIndex)} onValueChange={(v) => v && !isChecking && !readyToProceed && setLevelIndex(Number(v))}>
              <SelectTrigger className="w-28">
                <SelectValue>{() => `Уровень ${level.level}`}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {verbPictureLevels.map((l, idx) => (
                  <SelectItem key={l.level} value={String(idx)}>
                    Уровень {l.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(taskIndex)} onValueChange={(v) => v && !isChecking && !readyToProceed && setTaskIndex(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(taskIndex + 1)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {level.tasks.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {level.tasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-wrap justify-center gap-2 rounded-xl border bg-card p-3">
        {bank.map((w, idx) => (
          <Button
            key={`${w}-${idx}`}
            type="button"
            variant={selectedWord === w ? "default" : "secondary"}
            className="h-auto rounded-full px-4 py-2 text-base font-medium"
            disabled={isChecking || readyToProceed}
            onClick={() => onPickWord(w)}
          >
            {w}
          </Button>
        ))}
      </div>

      <div className={cn("grid gap-4 grid-cols-2", gridCols)}>
        {task.items.map((item, idx) => {
          const status = checkResult[idx];
          return (
            <div
              key={idx}
              className={cn(
                "flex flex-col gap-2 rounded-2xl border-2 p-3",
                (status === "correct" || locked[idx]) && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                status === "incorrect" && "border-destructive bg-destructive/10",
                !status && !locked[idx] && "border-border bg-card",
              )}
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="p-2 text-center text-xs text-muted-foreground">
                    {item.subject} … {item.object}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-foreground">
                <span>{item.subject}</span>
                <button
                  type="button"
                  onClick={() => onSlotClick(idx)}
                  disabled={isChecking || readyToProceed || locked[idx]}
                  className={cn(
                    "min-w-16 rounded-lg border-2 px-2 py-1 text-center font-semibold",
                    (status === "correct" || locked[idx]) && "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
                    status === "incorrect" && "border-destructive bg-destructive/20",
                    !status && !locked[idx] && placed[idx] && "border-primary bg-primary/10",
                    !status && !locked[idx] && !placed[idx] && "border-dashed border-muted-foreground/40 bg-muted/30",
                  )}
                >
                  {placed[idx] ?? "___"}
                </button>
                <span>{item.object}</span>
              </div>
            </div>
          );
        })}
      </div>

      {readyToProceed && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextTask} onFinish={handleFinish} />
      )}

      <TrainerCompletionOverlay variant={feedback} />
    </div>
  );
}
