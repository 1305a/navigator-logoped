import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verbPhraseExercises } from "@/data/verbPhrasesTrainer";
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

type SlotIndex = 0 | 1;
type Outcome = "correct" | "incorrect";
type Placed = { word: string; verbIndex: number; slotIndex: SlotIndex; status: Outcome | "pending" };

export default function VerbPhrasesTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const exercise = verbPhraseExercises[exerciseIndex];
  const words = useMemo(() => shuffleArray(exercise.allWords), [exercise.id]);

  const [placed, setPlaced] = useState<Placed[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [readyToProceed, setReadyToProceed] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const firstOutcomeRef = useRef<Record<string, Outcome>>({});
  const skipAutoCheckRef = useRef(false);

  useEffect(() => {
    skipAutoCheckRef.current = true;
    setPlaced([]);
    setSelectedWord(null);
    setAttempt(0);
    setIsChecking(false);
    setReadyToProceed(false);
  }, [exerciseIndex]);

  const isLast = exerciseIndex === verbPhraseExercises.length - 1;

  function registerFirst(key: string, isCorrect: boolean) {
    if (firstOutcomeRef.current[key]) return;
    firstOutcomeRef.current[key] = isCorrect ? "correct" : "incorrect";
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
  }

  const isSlotFilled = (verbIndex: number, slotIndex: SlotIndex) =>
    placed.some((p) => p.verbIndex === verbIndex && p.slotIndex === slotIndex);

  const allSlotsFilled = exercise.verbs.every((_, vi) =>
    ([0, 1] as SlotIndex[]).every((si) => isSlotFilled(vi, si)),
  );

  const availableWords = useMemo(() => {
    const used = new Set(placed.map((p) => p.word));
    return words.filter((w) => !used.has(w));
  }, [words, placed]);

  function check() {
    if (isChecking || readyToProceed || !allSlotsFilled) return;
    setIsChecking(true);

    const norm = (s: string) => s.trim().toLowerCase();
    const checked = placed.map((p) => {
      const correctPair = exercise.verbs[p.verbIndex].correctWords;
      const isCorrect = correctPair.some((c) => norm(c) === norm(p.word));
      registerFirst(`${exercise.id}:${p.verbIndex}:${p.slotIndex}`, isCorrect);
      return { ...p, status: isCorrect ? ("correct" as const) : ("incorrect" as const) };
    });
    setPlaced(checked);

    const allCorrect = checked.length === exercise.verbs.length * 2 && checked.every((p) => p.status === "correct");
    if (allCorrect) {
      window.setTimeout(() => {
        setIsChecking(false);
        setReadyToProceed(true);
      }, 1000);
      return;
    }

    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);

    window.setTimeout(() => {
      if (nextAttempt >= 3) {
        setPlaced(checked);
        setIsChecking(false);
        setSelectedWord(null);
        return;
      }
      setPlaced((prev) => prev.filter((p) => p.status === "correct"));
      setIsChecking(false);
      setSelectedWord(null);
    }, 1000);
  }

  useEffect(() => {
    if (skipAutoCheckRef.current) {
      if (placed.length === 0) skipAutoCheckRef.current = false;
      return;
    }
    if (!allSlotsFilled || isChecking || readyToProceed) return;
    if (!placed.some((p) => p.status === "pending")) return;
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed, allSlotsFilled, isChecking, readyToProceed]);

  function placeIntoSlot(verbIndex: number, slotIndex: SlotIndex) {
    if (!selectedWord || isChecking || readyToProceed) return;
    const current = placed.find((p) => p.verbIndex === verbIndex && p.slotIndex === slotIndex);
    if (current?.status === "correct" || current) return;
    setPlaced((prev) => [...prev, { word: selectedWord, verbIndex, slotIndex, status: "pending" }]);
    setSelectedWord(null);
  }

  function removePlaced(verbIndex: number, slotIndex: SlotIndex) {
    if (isChecking || readyToProceed) return;
    const current = placed.find((p) => p.verbIndex === verbIndex && p.slotIndex === slotIndex);
    if (current?.status === "correct") return;
    setPlaced((prev) => prev.filter((p) => !(p.verbIndex === verbIndex && p.slotIndex === slotIndex)));
  }

  function handleNext() {
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
        <h1 className="text-2xl font-semibold text-foreground">
          КОД 07 — Составить словосочетания (действия)
        </h1>
        <p className="text-sm text-muted-foreground">Подберите слова к глаголам (2 слова на каждый глагол)</p>
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
                {verbPhraseExercises.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {verbPhraseExercises.length}</span>
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
            className="h-auto rounded-lg px-4 py-2 text-sm font-medium lowercase"
            disabled={isChecking || readyToProceed}
            onClick={() => setSelectedWord((prev) => (prev === w ? null : w))}
          >
            {w.toLowerCase()}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {exercise.verbs.map((v, vi) => {
          const slot0 = placed.find((p) => p.verbIndex === vi && p.slotIndex === 0) ?? null;
          const slot1 = placed.find((p) => p.verbIndex === vi && p.slotIndex === 1) ?? null;
          return (
            <div key={vi} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <div className="min-w-28 rounded-lg border bg-sky-50 px-3 py-2 text-center text-sm font-medium text-foreground dark:bg-sky-950/30">
                {v.verb}
              </div>
              <div className="grid flex-1 grid-cols-2 gap-2">
                {([slot0, slot1] as const).map((slot, si) => (
                  <button
                    key={si}
                    type="button"
                    onClick={() =>
                      slot ? removePlaced(vi, si as SlotIndex) : placeIntoSlot(vi, si as SlotIndex)
                    }
                    disabled={isChecking || readyToProceed || slot?.status === "correct"}
                    className={cn(
                      "min-h-11 rounded-lg border px-2 py-1.5 text-center text-sm font-medium lowercase text-foreground",
                      slot?.status === "correct" && "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
                      slot?.status === "incorrect" && "border-destructive bg-destructive/20",
                      !slot?.status && "border-dashed border-muted-foreground/40 bg-muted/30",
                    )}
                  >
                    {slot?.word.toLowerCase() ?? ""}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {readyToProceed && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNext} onFinish={handleFinish} />
      )}
    </div>
  );
}
