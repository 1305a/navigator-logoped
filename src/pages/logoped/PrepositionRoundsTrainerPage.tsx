import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { prepositionRoundTasks } from "@/data/prepositionRoundsTrainer";
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

function normPrep(s: string) {
  return s.trim().toLowerCase();
}
function gapKey(cardIdx: number, phraseIdx: number) {
  return `${cardIdx}-${phraseIdx}`;
}

export default function PrepositionRoundsTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = prepositionRoundTasks[taskIndex];

  const [selectedPrep, setSelectedPrep] = useState<string | null>(null);
  const [filled, setFilled] = useState<Record<string, string>>({});
  const [wrongGapKey, setWrongGapKey] = useState<string | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    setSelectedPrep(null);
    setFilled({});
    setWrongGapKey(null);
  }, [taskIndex]);

  const isLastTask = taskIndex === prepositionRoundTasks.length - 1;

  function isCardComplete(cardIdx: number) {
    return task.cards[cardIdx].phrases.every((_, pIdx) => !!filled[gapKey(cardIdx, pIdx)]);
  }
  const isTaskComplete = task.cards.every((_, cardIdx) => isCardComplete(cardIdx));
  const fieldLocked = isTaskComplete;

  function togglePrep(p: string) {
    if (fieldLocked) return;
    setSelectedPrep((prev) => (prev === p ? null : p));
  }

  function onGapClick(cardIdx: number, phraseIdx: number, correctPreposition: string) {
    if (fieldLocked) return;
    const key = gapKey(cardIdx, phraseIdx);
    if (filled[key]) return;
    if (!selectedPrep) return;

    if (normPrep(selectedPrep) === normPrep(correctPreposition)) {
      setFilled((prev) => ({ ...prev, [key]: correctPreposition }));
      setCorrectCount((c) => c + 1);
      setSelectedPrep(null);
      setWrongGapKey(null);
      return;
    }

    setIncorrectCount((c) => c + 1);
    setWrongGapKey(key);
    window.setTimeout(() => {
      setWrongGapKey((prev) => (prev === key ? null : prev));
    }, 750);
  }

  function handleNextTask() {
    if (!isTaskComplete || isLastTask) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  const gridCols =
    task.cards.length >= 3 ? "md:grid-cols-3" : task.cards.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1";

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
        <h1 className="text-2xl font-semibold text-foreground">Расставить предлоги</h1>
        <p className="text-sm text-muted-foreground">
          Выберите предлог и нажмите на пропуск во фразе
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(taskIndex)} onValueChange={(v) => v && setTaskIndex(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(taskIndex + 1)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {prepositionRoundTasks.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {prepositionRoundTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {task.prepositions.map((p) => (
          <Button
            key={p}
            type="button"
            variant={selectedPrep === p ? "default" : "secondary"}
            className="h-auto rounded-lg px-4 py-2 text-sm font-medium"
            disabled={fieldLocked}
            onClick={() => togglePrep(p)}
          >
            {p.length <= 4 ? p.toUpperCase() : p}
          </Button>
        ))}
      </div>

      <div className={cn("grid gap-4 grid-cols-1", gridCols)}>
        {task.cards.map((card, cardIdx) => (
          <div
            key={card.id}
            className={cn(
              "flex flex-col gap-2 rounded-xl border p-3",
              isCardComplete(cardIdx) ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" : "border-border bg-card",
            )}
          >
            {card.phrases.map((phrase, phraseIdx) => {
              const key = gapKey(cardIdx, phraseIdx);
              const value = filled[key];
              const isWrong = wrongGapKey === key;
              return (
                <div
                  key={phrase.id}
                  className="flex flex-wrap items-center gap-1.5 rounded-lg border border-transparent px-1 py-1 text-sm text-foreground"
                >
                  <span>{phrase.before}</span>
                  <button
                    type="button"
                    onClick={() => onGapClick(cardIdx, phraseIdx, phrase.correctPreposition)}
                    disabled={fieldLocked || !!value}
                    className={cn(
                      "min-w-10 rounded-md border-2 px-2 py-0.5 text-center font-semibold",
                      value && "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
                      isWrong && "border-destructive bg-destructive/20 ring-2 ring-destructive",
                      !value && !isWrong && "border-dashed border-muted-foreground/40",
                    )}
                  >
                    {value ? value.toLowerCase() : "…"}
                  </button>
                  <span>{phrase.after}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {isTaskComplete && (
        <TrainerAdvanceButton isLast={isLastTask} onNext={handleNextTask} onFinish={handleFinish} />
      )}
    </div>
  );
}
