import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { CommonWordExercise } from "@/data/commonNounTrainer";
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

type Status = "correct" | "incorrect";

export interface CommonWordTrainerProps {
  title: string;
  description: string;
  exercises: CommonWordExercise[];
}

export function CommonWordTrainer({ title, description, exercises }: CommonWordTrainerProps) {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const exercise = exercises[exerciseIndex];

  const [availableWords, setAvailableWords] = useState<string[]>(() =>
    shuffleArray(exercise.availableWords),
  );
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Array<string | null>>([null, null, null]);
  const [statuses, setStatuses] = useState<Array<Status | null>>([null, null, null]);
  const [attempt, setAttempt] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const firstOutcomeRef = useRef<Record<string, Status>>({});
  const skipAutoCheckRef = useRef(false);

  useEffect(() => {
    skipAutoCheckRef.current = true;
    setAvailableWords(shuffleArray(exercise.availableWords));
    setSelectedWord(null);
    setPlaced([null, null, null]);
    setStatuses([null, null, null]);
    setAttempt(0);
    setIsChecking(false);
    setReadyToProceed(false);
    setFeedback(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseIndex]);

  const isLast = exerciseIndex === exercises.length - 1;
  const canCheck = placed.every((v) => !!v);

  function registerFirst(key: string, isCorrect: boolean) {
    if (firstOutcomeRef.current[key]) return;
    firstOutcomeRef.current[key] = isCorrect ? "correct" : "incorrect";
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
  }

  function handleCheck() {
    if (isChecking || readyToProceed || !canCheck) return;
    setIsChecking(true);

    const norm = (s: string) => s.trim().toLowerCase();
    const nextStatuses: Status[] = exercise.columns.map((col, idx) => {
      const isCorrect = norm(String(placed[idx])) === norm(col.answer);
      registerFirst(`${exercise.id}:${idx}`, isCorrect);
      return isCorrect ? "correct" : "incorrect";
    });
    setStatuses(nextStatuses);

    if (nextStatuses.every((s) => s === "correct")) {
      setFeedback("correct");
      window.setTimeout(() => setFeedback(null), 900);
      window.setTimeout(() => {
        setIsChecking(false);
        setReadyToProceed(true);
      }, 1000);
      return;
    }

    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);

    if (nextAttempt === 1) {
      window.setTimeout(() => {
        setPlaced([null, null, null]);
        setStatuses([null, null, null]);
        setSelectedWord(null);
        setAvailableWords(shuffleArray(exercise.availableWords));
        setIsChecking(false);
      }, 1000);
      return;
    }

    if (nextAttempt === 2) {
      window.setTimeout(() => {
        const keep: Array<string | null> = [null, null, null];
        const returned: string[] = [];
        for (let i = 0; i < 3; i++) {
          if (nextStatuses[i] === "correct") keep[i] = placed[i];
          else if (placed[i]) returned.push(placed[i]!);
        }
        setPlaced(keep);
        setStatuses([null, null, null]);
        setSelectedWord(null);
        setAvailableWords((prev) => shuffleArray([...prev, ...returned]));
        setIsChecking(false);
      }, 1000);
      return;
    }

    window.setTimeout(() => {
      const keep: Array<string | null> = [null, null, null];
      const needed: string[] = [];
      for (let i = 0; i < 3; i++) {
        if (nextStatuses[i] === "correct") keep[i] = placed[i];
        else needed.push(exercise.columns[i].answer);
      }
      setPlaced(keep);
      setStatuses([null, null, null]);
      setSelectedWord(null);
      setAvailableWords(shuffleArray(needed));
      setIsChecking(false);
    }, 1000);
  }

  useEffect(() => {
    if (skipAutoCheckRef.current) {
      if (placed.every((v) => v === null)) skipAutoCheckRef.current = false;
      return;
    }
    if (!canCheck || isChecking || readyToProceed) return;
    handleCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed, isChecking, readyToProceed]);

  function onPickWord(w: string) {
    if (isChecking || readyToProceed) return;
    setSelectedWord(w);
  }

  function onColumnClick(idx: number) {
    if (isChecking || readyToProceed) return;
    const current = placed[idx];
    if (current) {
      setPlaced((prev) => prev.map((v, i) => (i === idx ? null : v)));
      setAvailableWords((prev) => shuffleArray([...prev, current]));
      setStatuses((prev) => prev.map((v, i) => (i === idx ? null : v)));
      return;
    }
    if (!selectedWord) return;
    setPlaced((prev) => prev.map((v, i) => (i === idx ? selectedWord : v)));
    setAvailableWords((prev) => prev.filter((w) => w !== selectedWord));
    setSelectedWord(null);
    setStatuses((prev) => prev.map((v, i) => (i === idx ? null : v)));
  }

  function handleNextExercise() {
    if (isChecking || !readyToProceed || isLast) return;
    setExerciseIndex((i) => i + 1);
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
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select
              value={String(exerciseIndex)}
              onValueChange={(v) => v && !isChecking && !readyToProceed && setExerciseIndex(Number(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(exerciseIndex + 1)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {exercises.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {exercises.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {availableWords.map((w, idx) => (
          <Button
            key={`${w}-${idx}`}
            type="button"
            variant={selectedWord === w ? "default" : "secondary"}
            className="h-auto rounded-lg px-4 py-2 text-base font-medium"
            disabled={isChecking || readyToProceed}
            onClick={() => onPickWord(w)}
          >
            {w}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {exercise.columns.map((col, idx) => {
          const status = statuses[idx];
          return (
            <div
              key={idx}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border p-4 shadow-sm",
                status === "correct" && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                status === "incorrect" && "border-destructive bg-destructive/10",
                !status && "border-border bg-card",
              )}
            >
              <button
                type="button"
                onClick={() => onColumnClick(idx)}
                disabled={isChecking || readyToProceed}
                className={cn(
                  "flex min-h-14 items-center justify-center rounded-lg border-2 px-3 text-center text-base font-semibold text-foreground",
                  status === "correct" && "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
                  status === "incorrect" && "border-destructive bg-destructive/20",
                  !status && placed[idx] && "border-primary bg-primary/10",
                  !status && !placed[idx] && "border-dashed border-muted-foreground/40 bg-muted/30",
                )}
              >
                {placed[idx] ?? ""}
              </button>
              <div className="flex flex-col gap-1.5">
                {col.words.map((w) => (
                  <div
                    key={w}
                    className="rounded-lg border bg-muted/50 px-2 py-1.5 text-center text-sm text-foreground"
                  >
                    {w}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {readyToProceed && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextExercise} onFinish={handleFinish} />
      )}

      <TrainerCompletionOverlay variant={feedback} />
    </div>
  );
}
