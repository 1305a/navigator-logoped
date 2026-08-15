import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { paronymTasks } from "@/data/paronymsTrainer";
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

type Outcome = "correct" | "incorrect";

function isBankSlotVisible(values: string[], filled: Array<string | null>, wIdx: number) {
  const w = values[wIdx];
  const rankAmongSame = values.filter((x, j) => j < wIdx && x === w).length;
  const usedCount = filled.filter((f) => f === w).length;
  return rankAmongSame >= usedCount;
}

export default function ParonymsTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = paronymTasks[taskIndex];
  const n = task.phrases.length;

  const bankValues = useMemo(() => task.phrases.map((p) => p.value), [task]);
  const [bankOrder, setBankOrder] = useState<string[]>(() => shuffleArray(bankValues));

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [filled, setFilled] = useState<Array<string | null>>(Array(n).fill(null));
  const [lockedCorrect, setLockedCorrect] = useState<boolean[]>(Array(n).fill(false));
  const [lockedWrong, setLockedWrong] = useState<boolean[]>(Array(n).fill(false));
  const [validation, setValidation] = useState<Array<boolean | null>>(Array(n).fill(null));
  const [secondRound, setSecondRound] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const firstOutcomeRef = useRef<Record<string, Outcome>>({});
  const skipAutoValidateRef = useRef(false);

  useEffect(() => {
    skipAutoValidateRef.current = true;
    setBankOrder(shuffleArray(bankValues));
    setSelectedWord(null);
    setSelectedSlot(null);
    setFilled(new Array(n).fill(null));
    setLockedCorrect(new Array(n).fill(false));
    setLockedWrong(new Array(n).fill(false));
    setValidation(new Array(n).fill(null));
    setSecondRound(false);
    setIsValidating(false);
    setReadyToProceed(false);
    setFeedback(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIndex]);

  const isLast = taskIndex === paronymTasks.length - 1;
  const bankRemaining = bankOrder.filter((_, idx) => isBankSlotVisible(bankOrder, filled, idx));
  const allFilled = filled.every((v, i) => v !== null || lockedCorrect[i] || lockedWrong[i]);

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
      lockedCorrect[idx] || lockedWrong[idx] ? lockedCorrect[idx] : norm(val) === norm(task.phrases[idx].value),
    );

    if (!secondRound) {
      results.forEach((r, idx) => {
        if (!lockedCorrect[idx] && !lockedWrong[idx]) registerFirst(`${task.id}:${idx}`, r);
      });
    }
    setValidation(results);

    if (results.every(Boolean)) {
      setLockedCorrect(results);
      setFeedback("correct");
      window.setTimeout(() => setFeedback(null), 900);
      window.setTimeout(() => {
        setIsValidating(false);
        setReadyToProceed(true);
      }, 400);
      return;
    }

    if (!secondRound) {
      window.setTimeout(() => {
        const nextLocked = filled.map((_v, idx) => (results[idx] ? true : lockedCorrect[idx]));
        setLockedCorrect(nextLocked);
        setFilled((prev) => prev.map((v, idx) => (results[idx] ? v : null)));
        setValidation(nextLocked.map((lc) => (lc ? true : null)));
        setSelectedWord(null);
        setSelectedSlot(null);
        setSecondRound(true);
        setIsValidating(false);
      }, 1000);
      return;
    }

    window.setTimeout(() => {
      const nextCorrect = filled.map((_v, idx) => (results[idx] ? true : lockedCorrect[idx]));
      const nextWrong = filled.map((_v, idx) => (!results[idx] && !nextCorrect[idx] ? true : lockedWrong[idx]));
      setLockedCorrect(nextCorrect);
      setLockedWrong(nextWrong);
      setIsValidating(false);
      setReadyToProceed(true);
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

  function isLocked(idx: number) {
    return lockedCorrect[idx] || lockedWrong[idx];
  }

  function onBankWordClick(w: string) {
    if (readyToProceed || isValidating) return;
    if (selectedSlot !== null) {
      if (isLocked(selectedSlot)) return;
      setFilled((prev) => prev.map((v, i) => (i === selectedSlot ? w : v)));
      setSelectedWord(null);
      setSelectedSlot(null);
      return;
    }
    setSelectedWord((prev) => (prev === w ? null : w));
  }

  function onSlotClick(idx: number) {
    if (readyToProceed || isValidating || isLocked(idx)) return;
    if (filled[idx]) {
      setFilled((prev) => prev.map((v, i) => (i === idx ? null : v)));
      setValidation((prev) => prev.map((v, i) => (i === idx ? null : v)));
      return;
    }
    if (selectedWord) {
      setFilled((prev) => prev.map((v, i) => (i === idx ? selectedWord : v)));
      setSelectedWord(null);
      setSelectedSlot(null);
      return;
    }
    setSelectedSlot((prev) => (prev === idx ? null : idx));
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
        <h1 className="text-2xl font-semibold text-foreground">Паронимы в словосочетаниях</h1>
        <p className="text-sm text-muted-foreground">Подберите подходящее по смыслу слово к прилагательному</p>
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
                {paronymTasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {paronymTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {bankOrder.map((w, idx) => {
          if (!isBankSlotVisible(bankOrder, filled, idx)) return null;
          return (
            <Button
              key={idx}
              type="button"
              variant={selectedWord === w ? "default" : "secondary"}
              className="h-auto rounded-lg px-4 py-2 text-sm font-bold"
              disabled={isValidating || readyToProceed}
              onClick={() => onBankWordClick(w)}
            >
              {w}
            </Button>
          );
        })}
      </div>
      {bankRemaining.length === 0 && (
        <div className="text-center text-xs text-muted-foreground">Банк слов пуст</div>
      )}

      <div className="grid grid-cols-[1fr_1fr] gap-2 text-xs font-semibold text-muted-foreground">
        <div>Прилагательное</div>
        <div>Существительное</div>
      </div>
      <div className="flex flex-col gap-2">
        {task.phrases.map((row, idx) => {
          const val = filled[idx];
          const locked = isLocked(idx);
          const isCorrect = validation[idx] === true || lockedCorrect[idx];
          const isIncorrect = validation[idx] === false || lockedWrong[idx];
          return (
            <div key={idx} className="grid grid-cols-2 items-center gap-2">
              <div className="rounded-lg border bg-muted/30 px-3 py-2 text-center text-sm font-bold text-foreground">
                {row.phrase}
              </div>
              <button
                type="button"
                onClick={() => onSlotClick(idx)}
                disabled={isValidating || readyToProceed || locked}
                className={cn(
                  "min-h-11 rounded-lg border-2 px-3 py-2 text-center text-sm font-bold",
                  isCorrect && "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
                  isIncorrect && "border-destructive bg-destructive/20",
                  !isCorrect &&
                    !isIncorrect &&
                    selectedSlot === idx &&
                    "border-primary bg-primary/10",
                  !isCorrect && !isIncorrect && selectedSlot !== idx && val && "border-primary bg-primary/10",
                  !isCorrect && !isIncorrect && selectedSlot !== idx && !val && "border-dashed border-muted-foreground/40 bg-muted/30",
                )}
              >
                {val ?? "___"}
              </button>
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
