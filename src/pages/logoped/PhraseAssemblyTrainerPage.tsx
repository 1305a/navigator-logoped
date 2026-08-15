import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { phraseAssemblyTasks, expectedWords } from "@/data/phraseAssemblyTrainer";
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
import { shuffleArray } from "@/lib/trainer";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

type PhraseState = {
  bank: string[];
  slots: Array<string | null>;
  selectedWordIndex: number | null;
  status: "idle" | "correct" | "error";
  solved: boolean;
};

function createPhraseState(
  correct: (typeof phraseAssemblyTasks)[number]["phrases"][number]["correct"],
  hints: string[],
): PhraseState {
  const expected = expectedWords(correct, hints);
  return {
    bank: shuffleArray(expected),
    slots: new Array(hints.length).fill(null),
    selectedWordIndex: null,
    status: "idle",
    solved: false,
  };
}

function formatAssembledPhrase(words: string[]): string {
  const text = words.filter(Boolean).join(" ").trim();
  if (!text) return "";
  const capitalized = text.charAt(0).toLocaleUpperCase("ru-RU") + text.slice(1);
  return capitalized.endsWith(".") ? capitalized : `${capitalized}.`;
}

export default function PhraseAssemblyTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = phraseAssemblyTasks[taskIndex];

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [readyToProceed, setReadyToProceed] = useState(false);

  const [phrasesState, setPhrasesState] = useState<PhraseState[]>(() => [
    createPhraseState(task.phrases[0].correct, task.hints),
  ]);

  useEffect(() => {
    setReadyToProceed(false);
    setPhrasesState([createPhraseState(task.phrases[0].correct, task.hints)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIndex]);

  const activePhraseIndex = useMemo(
    () => phrasesState.findIndex((p) => !p.solved),
    [phrasesState],
  );

  const phraseIndicesToShow = useMemo(() => {
    if (phrasesState.length === 0) return [];
    const top = activePhraseIndex === -1 ? phrasesState.length - 1 : activePhraseIndex;
    return Array.from({ length: top + 1 }, (_, i) => top - i);
  }, [phrasesState.length, activePhraseIndex]);

  const allSolved =
    phrasesState.length === task.phrases.length && phrasesState.every((p) => p.solved);

  useEffect(() => {
    if (allSolved) setReadyToProceed(true);
  }, [allSolved]);

  const isLast = taskIndex === phraseAssemblyTasks.length - 1;

  function handleNextTask() {
    if (!readyToProceed || isLast) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  function handleBankWordClick(phraseIndex: number, wordIndex: number) {
    if (readyToProceed) return;
    const phrase = phrasesState[phraseIndex];
    if (!phrase || phrase.solved) return;
    const next = [...phrasesState];
    const isSame = phrase.selectedWordIndex === wordIndex;
    next[phraseIndex] = {
      ...phrase,
      selectedWordIndex: isSame ? null : wordIndex,
      status: phrase.status === "error" ? "idle" : phrase.status,
    };
    setPhrasesState(next);
  }

  function handleSlotClick(phraseIndex: number, slotIndex: number) {
    if (readyToProceed) return;
    const phrase = phrasesState[phraseIndex];
    if (!phrase || phrase.solved) return;
    const next = [...phrasesState];

    if (phrase.slots[slotIndex]) {
      const word = phrase.slots[slotIndex]!;
      const nextSlots = [...phrase.slots];
      nextSlots[slotIndex] = null;
      next[phraseIndex] = {
        ...phrase,
        slots: nextSlots,
        bank: [...phrase.bank, word],
        selectedWordIndex: null,
        status: "idle",
      };
      setPhrasesState(next);
      return;
    }

    if (phrase.selectedWordIndex === null) return;
    const selectedWord = phrase.bank[phrase.selectedWordIndex];
    if (!selectedWord) return;

    const nextBank = [...phrase.bank];
    nextBank.splice(phrase.selectedWordIndex, 1);
    const nextSlots = [...phrase.slots];
    nextSlots[slotIndex] = selectedWord;

    const filled = nextSlots.every((w) => w !== null);
    if (!filled) {
      next[phraseIndex] = {
        ...phrase,
        bank: nextBank,
        slots: nextSlots,
        selectedWordIndex: null,
        status: "idle",
      };
      setPhrasesState(next);
      return;
    }

    const expected = expectedWords(task.phrases[phraseIndex].correct, task.hints);
    const correct = nextSlots.every((w, i) => w === expected[i]);

    if (correct) {
      next[phraseIndex] = {
        ...phrase,
        bank: nextBank,
        slots: nextSlots,
        selectedWordIndex: null,
        status: "correct",
        solved: true,
      };
      const nextPhraseIdx = phraseIndex + 1;
      if (nextPhraseIdx < task.phrases.length) {
        next.push(createPhraseState(task.phrases[nextPhraseIdx].correct, task.hints));
      }
      setPhrasesState(next);
      setCorrectCount((c) => c + 1);
      return;
    }

    next[phraseIndex] = {
      ...phrase,
      bank: nextBank,
      slots: nextSlots,
      selectedWordIndex: null,
      status: "error",
    };
    setPhrasesState(next);
    setIncorrectCount((c) => c + 1);

    window.setTimeout(() => {
      setPhrasesState((prev) => {
        const cur = prev[phraseIndex];
        if (!cur || cur.solved) return prev;
        const reset = [...prev];
        reset[phraseIndex] = createPhraseState(task.phrases[phraseIndex].correct, task.hints);
        return reset;
      });
    }, 500);
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
        <h1 className="text-2xl font-semibold text-foreground">Составьте фразы</h1>
        <p className="text-sm text-muted-foreground">Составьте предложение из слов по подсказкам</p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select
              value={String(taskIndex)}
              onValueChange={(v) => v && !readyToProceed && setTaskIndex(Number(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(task.id)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {phraseAssemblyTasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {phraseAssemblyTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-col gap-2">
        {phraseIndicesToShow.map((phraseIndex) => {
          const phrase = phrasesState[phraseIndex];
          if (!phrase) return null;
          const isActive = phraseIndex === activePhraseIndex;
          const expectedText = formatAssembledPhrase(
            expectedWords(task.phrases[phraseIndex].correct, task.hints),
          );
          const solved = phrase.solved;
          const error = phrase.status === "error";

          return (
            <div
              key={phraseIndex}
              className={cn(
                "rounded-2xl border px-4 py-3",
                solved && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                error && "border-destructive bg-destructive/10",
                !solved && !error && "border-border bg-card",
              )}
            >
              {solved || !isActive ? (
                <div className="py-1 text-center text-base text-foreground">{expectedText}</div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap justify-center gap-2">
                    {phrase.bank.map((word, wordIndex) => (
                      <Button
                        key={`${word}-${wordIndex}`}
                        type="button"
                        variant={phrase.selectedWordIndex === wordIndex ? "default" : "secondary"}
                        className="h-auto rounded-lg px-4 py-2 text-sm font-medium"
                        onClick={() => handleBankWordClick(phraseIndex, wordIndex)}
                      >
                        {word}
                      </Button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {task.hints.map((label, slotIndex) => {
                      const filled = phrase.slots[slotIndex];
                      return (
                        <button
                          key={slotIndex}
                          type="button"
                          onClick={() => handleSlotClick(phraseIndex, slotIndex)}
                          className={cn(
                            "min-h-14 rounded-lg border-2 px-2 py-1.5 text-center",
                            error
                              ? "border-destructive bg-destructive/10"
                              : filled
                                ? "border-primary bg-primary/10"
                                : "border-dashed border-muted-foreground/40 bg-muted/30",
                          )}
                        >
                          <div className="text-[10px] font-semibold text-muted-foreground">{label}</div>
                          <div className="text-sm font-bold text-foreground">{filled ?? "—"}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {readyToProceed && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextTask} onFinish={handleFinish} />
      )}
    </div>
  );
}
