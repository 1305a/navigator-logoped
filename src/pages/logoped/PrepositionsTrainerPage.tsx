import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { prepositionLevels } from "@/data/prepositionsTrainer";
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

interface Option {
  id: string;
  label: string;
  phraseId: string;
}

export default function PrepositionsTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [levelIndex, setLevelIndex] = useState(0);
  const level = prepositionLevels[levelIndex];
  const [taskIndex, setTaskIndex] = useState(0);
  const task = level.tasks[taskIndex];

  const [options, setOptions] = useState<Option[]>([]);
  const [filledOption, setFilledOption] = useState<Record<string, string | null>>({});
  const [lockedCorrect, setLockedCorrect] = useState<Record<string, boolean>>({});
  const [checkResult, setCheckResult] = useState<Record<string, "correct" | "incorrect" | null>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedBlankPhraseId, setSelectedBlankPhraseId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | null>(null);
  const taskHadErrorRef = useRef(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    setTaskIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setReadyToProceed(false);
  }, [levelIndex]);

  useEffect(() => {
    const opts = task.phrases.map((p) => ({ id: `opt-${p.id}`, label: p.correctPreposition, phraseId: p.id }));
    setOptions(shuffleArray(opts));
    setFilledOption({});
    setLockedCorrect({});
    setCheckResult({});
    setSelectedOptionId(null);
    setSelectedBlankPhraseId(null);
    setIsValidating(false);
    setReadyToProceed(false);
    setFeedback(null);
    taskHadErrorRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIndex, levelIndex]);

  const isLastTask = taskIndex === level.tasks.length - 1;
  const isLastLevel = levelIndex === prepositionLevels.length - 1;

  function isOptionInUse(optionId: string, exceptPhraseId?: string) {
    return Object.entries(filledOption).some(([phraseId, oid]) => oid === optionId && phraseId !== exceptPhraseId);
  }

  function placeOption(phraseId: string, optionId: string) {
    if (isValidating || readyToProceed) return;
    if (lockedCorrect[phraseId]) return;
    if (isOptionInUse(optionId, phraseId)) return;
    setFilledOption((prev) => ({ ...prev, [phraseId]: optionId }));
    setCheckResult((prev) => ({ ...prev, [phraseId]: null }));
    setSelectedOptionId(null);
    setSelectedBlankPhraseId(null);
  }

  function handleOptionClick(optionId: string) {
    if (isValidating || readyToProceed) return;
    if (selectedBlankPhraseId) {
      placeOption(selectedBlankPhraseId, optionId);
      return;
    }
    setSelectedOptionId((prev) => (prev === optionId ? null : optionId));
    setSelectedBlankPhraseId(null);
  }

  function handleBlankClick(phraseId: string) {
    if (isValidating || readyToProceed || lockedCorrect[phraseId]) return;
    if (selectedOptionId) {
      placeOption(phraseId, selectedOptionId);
      return;
    }
    setSelectedBlankPhraseId((prev) => (prev === phraseId ? null : phraseId));
    setSelectedOptionId(null);
  }

  const allFilled = task.phrases.every((p) => lockedCorrect[p.id] || filledOption[p.id]);
  const needsValidation =
    allFilled && task.phrases.some((p) => !lockedCorrect[p.id] && checkResult[p.id] === undefined);

  function validate() {
    if (!allFilled || isValidating || readyToProceed) return;
    setIsValidating(true);

    let allCorrect = true;
    const nextLocked = { ...lockedCorrect };
    const nextResult = { ...checkResult };
    task.phrases.forEach((p) => {
      if (nextLocked[p.id]) return;
      const optionId = filledOption[p.id];
      const isCorrect = optionId === `opt-${p.id}`;
      if (!isCorrect) allCorrect = false;
      nextLocked[p.id] = isCorrect;
      nextResult[p.id] = isCorrect ? "correct" : "incorrect";
    });
    setLockedCorrect(nextLocked);
    setCheckResult(nextResult);

    if (!allCorrect) taskHadErrorRef.current = true;

    if (allCorrect) {
      if (taskHadErrorRef.current) setIncorrectCount((c) => c + 1);
      else setCorrectCount((c) => c + 1);
      setFeedback("correct");
      window.setTimeout(() => setFeedback(null), 900);
      window.setTimeout(() => {
        setIsValidating(false);
        setReadyToProceed(true);
      }, 900);
      return;
    }

    window.setTimeout(() => {
      setFilledOption((prev) => {
        const next = { ...prev };
        task.phrases.forEach((p) => {
          if (!nextLocked[p.id]) next[p.id] = null;
        });
        return next;
      });
      setCheckResult((prev) => {
        const next = { ...prev };
        task.phrases.forEach((p) => {
          if (!nextLocked[p.id]) next[p.id] = null;
        });
        return next;
      });
      setIsValidating(false);
    }, 1000);
  }

  useEffect(() => {
    if (!needsValidation || isValidating || readyToProceed) return;
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsValidation, isValidating, readyToProceed]);

  function handleNext() {
    if (isValidating || !readyToProceed) return;
    if (!isLastTask) {
      setTaskIndex((i) => i + 1);
      return;
    }
    if (!isLastLevel) setLevelIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  const bankOptions = useMemo(
    () => options.filter((o) => !isOptionInUse(o.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options, filledOption],
  );

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
        <h1 className="text-2xl font-semibold text-foreground">Вставьте предлоги</h1>
        <p className="text-sm text-muted-foreground">Выберите предлог и вставьте его в пропуск в словосочетании</p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Уровень</Label>
            <Select
              value={String(levelIndex)}
              onValueChange={(v) => v && !isValidating && !readyToProceed && setLevelIndex(Number(v))}
            >
              <SelectTrigger className="w-28">
                <SelectValue>{() => `Уровень ${level.level}`}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {prepositionLevels.map((l, idx) => (
                  <SelectItem key={l.id} value={String(idx)}>
                    Уровень {l.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select
              value={String(taskIndex)}
              onValueChange={(v) => v && !isValidating && !readyToProceed && setTaskIndex(Number(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(task.id)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {level.tasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
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

      <div className="flex flex-wrap justify-center gap-2">
        {bankOptions.map((o) => (
          <Button
            key={o.id}
            type="button"
            variant={selectedOptionId === o.id ? "default" : "secondary"}
            className="h-auto rounded-lg px-4 py-2 text-sm font-medium"
            disabled={isValidating || readyToProceed}
            onClick={() => handleOptionClick(o.id)}
          >
            {o.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {task.phrases.map((p) => {
          const locked = lockedCorrect[p.id];
          const result = checkResult[p.id];
          const optionId = filledOption[p.id];
          const label = optionId ? options.find((o) => o.id === optionId)?.label : null;
          return (
            <div
              key={p.id}
              className={cn(
                "flex flex-wrap items-center gap-2 rounded-xl border p-3 text-base text-foreground",
                (locked || result === "correct") && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                result === "incorrect" && "border-destructive bg-destructive/10",
                !locked && !result && "border-border bg-card",
              )}
            >
              <span>{p.before}</span>
              <button
                type="button"
                onClick={() => handleBlankClick(p.id)}
                disabled={isValidating || readyToProceed || locked}
                className={cn(
                  "min-w-14 rounded-lg border-2 px-3 py-1 text-center font-semibold",
                  (locked || result === "correct") && "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
                  result === "incorrect" && "border-destructive bg-destructive/20",
                  !locked && !result && selectedBlankPhraseId === p.id && "border-primary bg-primary/10",
                  !locked && !result && selectedBlankPhraseId !== p.id && "border-dashed border-muted-foreground/40",
                )}
              >
                {label ?? "___"}
              </button>
              <span>{p.after}</span>
            </div>
          );
        })}
      </div>

      {readyToProceed && (isLastTask && isLastLevel ? (
        <div className="flex justify-center">
          <Button type="button" size="lg" className="rounded-full" onClick={handleFinish}>
            Завершить тренажёр
          </Button>
        </div>
      ) : (
        <TrainerAdvanceButton isLast={false} onNext={handleNext} onFinish={handleFinish} />
      ))}

      <TrainerCompletionOverlay variant={feedback} />
    </div>
  );
}
