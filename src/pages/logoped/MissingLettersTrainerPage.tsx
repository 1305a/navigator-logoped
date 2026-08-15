import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { missingLettersTasks } from "@/data/missingLettersTrainer";
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

type Token =
  | { kind: "text"; value: string }
  | { kind: "blank"; id: string; correctLetter: string; sentenceStart: boolean };

function isSentenceStartBlank(text: string, blankIndex: number): boolean {
  let i = blankIndex - 1;
  while (i >= 0 && text[i] === " ") i--;
  if (i < 0) return true;
  return [".", "!", "?", "…"].includes(text[i]);
}

function tokenize(text: string, correctText: string): Token[] {
  const tokens: Token[] = [];
  let blankSeq = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "_") {
      blankSeq += 1;
      tokens.push({
        kind: "blank",
        id: `b${blankSeq}`,
        correctLetter: (correctText[i] ?? "").toLocaleLowerCase("ru-RU"),
        sentenceStart: isSentenceStartBlank(text, i),
      });
    } else {
      tokens.push({ kind: "text", value: ch });
    }
  }
  return tokens;
}

function letterPalette(tokens: Token[]): string[] {
  const seen = new Set<string>();
  const letters: string[] = [];
  for (const t of tokens) {
    if (t.kind !== "blank") continue;
    if (seen.has(t.correctLetter)) continue;
    seen.add(t.correctLetter);
    letters.push(t.correctLetter);
  }
  return letters;
}

type BlankRuntime = {
  filledLetter: string | null;
  lockedCorrect: boolean;
  checkResult: "correct" | "incorrect" | null;
};

export default function MissingLettersTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = missingLettersTasks[taskIndex];
  const tokens = useMemo(() => tokenize(task.text, task.correctText), [task]);
  const palette = useMemo(() => letterPalette(tokens), [tokens]);
  const blankTokens = useMemo(() => tokens.filter((t): t is Extract<Token, { kind: "blank" }> => t.kind === "blank"), [tokens]);

  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [blanks, setBlanks] = useState<Record<string, BlankRuntime>>({});
  const [attempt, setAttempt] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const firstOutcomeRef = useRef<Record<string, "correct" | "incorrect">>({});

  useEffect(() => {
    const init: Record<string, BlankRuntime> = {};
    blankTokens.forEach((t) => {
      init[t.id] = { filledLetter: null, lockedCorrect: false, checkResult: null };
    });
    setBlanks(init);
    setSelectedLetter(null);
    setAttempt(0);
    setIsValidating(false);
    setReadyToProceed(false);
    setFeedback(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIndex]);

  const isLast = taskIndex === missingLettersTasks.length - 1;

  function registerFirst(key: string, isCorrect: boolean) {
    if (firstOutcomeRef.current[key]) return;
    firstOutcomeRef.current[key] = isCorrect ? "correct" : "incorrect";
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
  }

  const allFilled =
    blankTokens.length > 0 &&
    blankTokens.every((t) => blanks[t.id]?.lockedCorrect || blanks[t.id]?.filledLetter);
  const needsValidation =
    allFilled && blankTokens.some((t) => !blanks[t.id]?.lockedCorrect && blanks[t.id]?.checkResult === null);

  function validate() {
    if (!needsValidation || isValidating || readyToProceed) return;
    setIsValidating(true);

    let allCorrect = true;
    const next: Record<string, BlankRuntime> = { ...blanks };
    blankTokens.forEach((t) => {
      const b = next[t.id];
      if (b.lockedCorrect) return;
      const isCorrect = (b.filledLetter ?? "").toLocaleLowerCase("ru-RU") === t.correctLetter;
      if (!isCorrect) allCorrect = false;
      registerFirst(`${task.id}:${t.id}`, isCorrect);
      next[t.id] = { ...b, lockedCorrect: isCorrect, checkResult: isCorrect ? "correct" : "incorrect" };
    });
    setBlanks(next);

    if (allCorrect) {
      setFeedback("correct");
      window.setTimeout(() => setFeedback(null), 900);
      window.setTimeout(() => {
        setIsValidating(false);
        setReadyToProceed(true);
      }, 900);
      return;
    }

    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);

    if (nextAttempt === 1) {
      window.setTimeout(() => {
        setBlanks((prev) => {
          const reset = { ...prev };
          blankTokens.forEach((t) => {
            if (!reset[t.id].lockedCorrect) {
              reset[t.id] = { filledLetter: null, lockedCorrect: false, checkResult: null };
            }
          });
          return reset;
        });
        setIsValidating(false);
      }, 7000);
      return;
    }

    window.setTimeout(() => setIsValidating(false), 400);
  }

  useEffect(() => {
    if (!needsValidation || isValidating || readyToProceed) return;
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsValidation, isValidating, readyToProceed]);

  function handleBlankClick(id: string, sentenceStart: boolean) {
    if (isValidating || readyToProceed) return;
    const b = blanks[id];
    if (!b || b.lockedCorrect) return;
    if (attempt === 1 && b.checkResult === "incorrect") return;
    if (!selectedLetter) return;
    const letter = sentenceStart ? selectedLetter.toLocaleUpperCase("ru-RU") : selectedLetter;
    setBlanks((prev) => ({ ...prev, [id]: { ...prev[id], filledLetter: letter, checkResult: null } }));
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
        <h1 className="text-2xl font-semibold text-foreground">Вставьте пропущенные буквы</h1>
        <p className="text-sm text-muted-foreground">Выберите гласную и вставьте её в пропуск в тексте</p>
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
                {missingLettersTasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {missingLettersTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {palette.map((letter) => (
          <Button
            key={letter}
            type="button"
            variant={selectedLetter === letter ? "default" : "secondary"}
            className="size-11 rounded-lg p-0 text-lg font-bold uppercase"
            disabled={isValidating || readyToProceed}
            onClick={() => setSelectedLetter((prev) => (prev === letter ? null : letter))}
          >
            {letter}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="mb-3 text-center text-base font-bold text-foreground">{task.heading}</div>
        <p className="text-lg leading-relaxed text-foreground">
          {tokens.map((t, idx) => {
            if (t.kind === "text") return <span key={idx}>{t.value}</span>;
            const b = blanks[t.id];
            const isLocked = b?.lockedCorrect;
            const isIncorrect = b?.checkResult === "incorrect";
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleBlankClick(t.id, t.sentenceStart)}
                disabled={isValidating || readyToProceed || isLocked}
                className={cn(
                  "mx-0.5 inline-flex min-w-6 items-center justify-center rounded border-b-2 px-0.5 align-baseline font-semibold",
                  isLocked && "border-emerald-500 bg-emerald-100 text-foreground dark:bg-emerald-900/40",
                  !isLocked && isIncorrect && "border-destructive bg-destructive/20",
                  !isLocked && !isIncorrect && "border-primary/60 bg-primary/5",
                )}
              >
                {b?.filledLetter ?? "  "}
              </button>
            );
          })}
        </p>
      </div>

      {readyToProceed && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextTask} onFinish={handleFinish} />
      )}

      <TrainerCompletionOverlay variant={feedback} />
    </div>
  );
}
