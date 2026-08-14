import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verbPrefixTasks } from "@/data/verbPrefixTrainer";
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
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

function isPrefixSlotVisible(prefixes: string[], filled: Array<string | null>, pIdx: number) {
  const p = prefixes[pIdx];
  const rankAmongSame = prefixes.filter((x, j) => j < pIdx && x === p).length;
  const usedCount = filled.filter((f) => f === p).length;
  return rankAmongSame >= usedCount;
}

function mergedSentence(text: string, prefix: string) {
  const [before, after] = text.split("___");
  return `${before}${prefix.replace(/-+$/, "")}${after ?? ""}`;
}

export default function VerbPrefixTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = verbPrefixTasks[taskIndex];
  const n = task.sentences.length;

  const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null);
  const [selectedBlankIndex, setSelectedBlankIndex] = useState<number | null>(null);
  const [filled, setFilled] = useState<Array<string | null>>(Array(n).fill(null));
  const [lockedCorrect, setLockedCorrect] = useState<boolean[]>(Array(n).fill(false));
  const [validation, setValidation] = useState<Array<boolean | null>>(Array(n).fill(null));
  const [attempt, setAttempt] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const firstOutcomeRef = useRef<Record<string, "correct" | "incorrect">>({});
  const skipAutoValidateRef = useRef(false);

  useEffect(() => {
    skipAutoValidateRef.current = true;
    setReadyToProceed(false);
    setFeedback(null);
    setFilled(new Array(n).fill(null));
    setLockedCorrect(new Array(n).fill(false));
    setValidation(new Array(n).fill(null));
    setSelectedPrefix(null);
    setSelectedBlankIndex(null);
    setAttempt(0);
    setIsValidating(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIndex]);

  const isLast = taskIndex === verbPrefixTasks.length - 1;
  const allFilled = filled.every((v) => v !== null);

  function registerFirst(key: string, isCorrect: boolean) {
    if (firstOutcomeRef.current[key]) return;
    firstOutcomeRef.current[key] = isCorrect ? "correct" : "incorrect";
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
  }

  function validate() {
    if (!allFilled || isValidating || readyToProceed) return;
    setIsValidating(true);

    const norm = (s: string | null) => String(s ?? "").trim().toLowerCase();
    const results = filled.map((val, idx) =>
      lockedCorrect[idx] ? true : norm(val) === norm(task.sentences[idx].correctPrefix),
    );
    results.forEach((r, idx) => {
      if (!lockedCorrect[idx]) registerFirst(`${task.id}:${idx}`, r);
    });
    setValidation(results);

    if (results.every(Boolean)) {
      setFeedback("correct");
      window.setTimeout(() => setFeedback(null), 900);
      window.setTimeout(() => {
        setIsValidating(false);
        setReadyToProceed(true);
      }, 400);
      return;
    }

    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);

    if (nextAttempt >= 3) {
      const newFilled = filled.map((v, idx) => (results[idx] ? v : null));
      setLockedCorrect(results);
      window.setTimeout(() => {
        setFilled(newFilled);
        setValidation(new Array(n).fill(null));
        setSelectedPrefix(null);
        setSelectedBlankIndex(null);
        setIsValidating(false);
      }, 1000);
      return;
    }

    window.setTimeout(() => {
      setFilled(new Array(n).fill(null));
      setValidation(new Array(n).fill(null));
      setSelectedPrefix(null);
      setSelectedBlankIndex(null);
      setIsValidating(false);
    }, 1000);
  }

  useEffect(() => {
    if (skipAutoValidateRef.current) {
      if (filled.every((v) => v === null)) skipAutoValidateRef.current = false;
      return;
    }
    if (!allFilled || isValidating || readyToProceed) return;
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filled, isValidating, readyToProceed]);

  function onPrefixClick(p: string) {
    if (readyToProceed || isValidating) return;
    if (selectedBlankIndex !== null) {
      if (lockedCorrect[selectedBlankIndex]) return;
      setFilled((prev) => prev.map((v, i) => (i === selectedBlankIndex ? p : v)));
      setSelectedPrefix(null);
      setSelectedBlankIndex(null);
      return;
    }
    setSelectedPrefix((prev) => (prev === p ? null : p));
  }

  function onBlankClick(idx: number) {
    if (readyToProceed || isValidating || lockedCorrect[idx]) return;
    if (selectedPrefix) {
      setFilled((prev) => prev.map((v, i) => (i === idx ? selectedPrefix : v)));
      setSelectedPrefix(null);
      setSelectedBlankIndex(null);
      return;
    }
    setSelectedBlankIndex((prev) => (prev === idx ? null : idx));
  }

  function clearBlank(idx: number) {
    if (readyToProceed || isValidating || lockedCorrect[idx]) return;
    setFilled((prev) => prev.map((v, i) => (i === idx ? null : v)));
  }

  function handleNextTask() {
    if (isValidating || !readyToProceed || isLast) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-1 gap-1.5"
          render={<Link to="/logoped/exercise-bank" />}
        >
          <ArrowLeft className="size-4" /> Банк упражнений
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Глагол с приставками</h1>
        <p className="text-sm text-muted-foreground">
          Добавьте приставку к глаголу в каждом предложении
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select
              value={String(taskIndex)}
              onValueChange={(v) => v && !isValidating && !readyToProceed && setTaskIndex(Number(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(task.id)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {verbPrefixTasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {verbPrefixTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {task.prefixes.map((p, pIdx) => {
          if (!isPrefixSlotVisible(task.prefixes, filled, pIdx)) return null;
          return (
            <Button
              key={pIdx}
              type="button"
              variant={selectedPrefix === p ? "default" : "secondary"}
              className="h-auto rounded-lg px-4 py-2 text-lg font-medium"
              disabled={isValidating || readyToProceed}
              onClick={() => onPrefixClick(p)}
            >
              {p}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {task.sentences.map((s, idx) => {
          const val = filled[idx];
          const isLocked = lockedCorrect[idx];
          const isCorrect = validation[idx] === true || isLocked;
          const isIncorrect = validation[idx] === false;
          const [before, after] = s.text.split("___");
          const canPlaceHere = selectedPrefix !== null && val === null;

          return (
            <div
              key={idx}
              className={cn(
                "flex flex-wrap items-center gap-2 rounded-xl border p-3 text-base text-foreground",
                isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                isIncorrect && "border-destructive bg-destructive/10",
                !isCorrect &&
                  !isIncorrect &&
                  (selectedBlankIndex === idx || canPlaceHere) &&
                  "border-primary bg-primary/5",
                !isCorrect && !isIncorrect && selectedBlankIndex !== idx && !canPlaceHere && "border-border",
              )}
            >
              {isCorrect && val ? (
                <span>{mergedSentence(s.text, val)}</span>
              ) : (
                <>
                  <span>{before}</span>
                  <button
                    type="button"
                    onClick={() => (val ? clearBlank(idx) : onBlankClick(idx))}
                    disabled={isValidating || isLocked || readyToProceed}
                    className={cn(
                      "min-w-22 rounded-lg border-2 px-3 py-1.5 font-semibold",
                      isIncorrect ? "border-destructive" : "border-dashed border-muted-foreground/40",
                      val && "bg-primary/10",
                    )}
                  >
                    {val ?? "___"}
                  </button>
                  <span>{after ?? ""}</span>
                </>
              )}
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
