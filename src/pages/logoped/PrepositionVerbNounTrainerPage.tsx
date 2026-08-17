import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CARDS_BY_LEVEL, prepositionImageTasks } from "@/data/prepositionVerbNounTrainer";
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

export default function PrepositionVerbNounTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [taskIndex, setTaskIndex] = useState(0);
  const task = prepositionImageTasks[taskIndex];
  const activePhrases = task.phrases.slice(0, CARDS_BY_LEVEL[level]);

  const [selectedPrep, setSelectedPrep] = useState<string | null>(null);
  const [filled, setFilled] = useState<Record<number, string>>({});
  const [usedPrepositions, setUsedPrepositions] = useState<Set<string>>(new Set());
  const [wrongPhraseId, setWrongPhraseId] = useState<number | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    setSelectedPrep(null);
    setFilled({});
    setUsedPrepositions(new Set());
    setWrongPhraseId(null);
  }, [taskIndex, level]);

  const isLastTask = taskIndex === prepositionImageTasks.length - 1;
  const isLastLevel = level === 3;
  const isTaskComplete = activePhrases.every((p) => !!filled[p.id]);
  const fieldLocked = isTaskComplete;
  const availablePrepositions = task.prepositions.filter((p) => !usedPrepositions.has(normPrep(p)));

  function togglePrep(p: string) {
    if (fieldLocked) return;
    setSelectedPrep((prev) => (prev === p ? null : p));
  }

  function onGapClick(phraseId: number, correctPreposition: string) {
    if (fieldLocked) return;
    if (filled[phraseId]) return;
    if (!selectedPrep) return;

    if (normPrep(selectedPrep) === normPrep(correctPreposition)) {
      setFilled((prev) => ({ ...prev, [phraseId]: correctPreposition }));
      setUsedPrepositions((prev) => new Set(prev).add(normPrep(correctPreposition)));
      setCorrectCount((c) => c + 1);
      setSelectedPrep(null);
      setWrongPhraseId(null);
      return;
    }

    setIncorrectCount((c) => c + 1);
    setWrongPhraseId(phraseId);
    window.setTimeout(() => {
      setWrongPhraseId((prev) => (prev === phraseId ? null : prev));
    }, 750);
  }

  function handleLevelChange(next: 1 | 2 | 3) {
    setLevel(next);
    setTaskIndex(0);
  }

  function handleNextTask() {
    if (!isTaskComplete) return;
    if (!isLastTask) {
      setTaskIndex((i) => i + 1);
      return;
    }
    if (!isLastLevel) handleLevelChange((level + 1) as 1 | 2 | 3);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  const gridCols = activePhrases.length <= 2 ? "sm:grid-cols-2" : activePhrases.length <= 4 ? "sm:grid-cols-2" : "sm:grid-cols-3";

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
        <h1 className="text-2xl font-semibold text-foreground">
          Расставьте предлоги (глагол + существительное)
        </h1>
        <p className="text-sm text-muted-foreground">
          Выберите предлог и нажмите на пропуск во фразе
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Уровень</Label>
            <Select value={String(level)} onValueChange={(v) => v && handleLevelChange(Number(v) as 1 | 2 | 3)}>
              <SelectTrigger className="w-28">
                <SelectValue>{() => `Уровень ${level}`}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Уровень 1</SelectItem>
                <SelectItem value="2">Уровень 2</SelectItem>
                <SelectItem value="3">Уровень 3</SelectItem>
              </SelectContent>
            </Select>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(taskIndex)} onValueChange={(v) => v && setTaskIndex(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(taskIndex + 1)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {prepositionImageTasks.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {prepositionImageTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {availablePrepositions.map((p) => (
          <Button
            key={p}
            type="button"
            variant={selectedPrep === p ? "default" : "secondary"}
            className="h-auto rounded-lg px-4 py-2 text-sm font-medium"
            onClick={() => togglePrep(p)}
          >
            {p.length <= 6 ? p.toUpperCase() : p}
          </Button>
        ))}
      </div>

      <div className={cn("grid gap-4 grid-cols-1", gridCols)}>
        {activePhrases.map((phrase) => {
          const value = filled[phrase.id];
          const isWrong = wrongPhraseId === phrase.id;
          return (
            <div
              key={phrase.id}
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border p-3 text-center shadow-sm",
                value ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" : "border-border bg-card",
              )}
            >
              <div className="flex aspect-square w-full max-w-40 items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                {phrase.imageUrl ? (
                  <img src={phrase.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="p-2 text-xs text-muted-foreground">{phrase.before} {phrase.after}</span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-foreground">
                <span>{phrase.before}</span>
                <button
                  type="button"
                  onClick={() => onGapClick(phrase.id, phrase.correctPreposition)}
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
            </div>
          );
        })}
      </div>

      {isTaskComplete && (
        <TrainerAdvanceButton isLast={isLastTask && isLastLevel} onNext={handleNextTask} onFinish={handleFinish} />
      )}
    </div>
  );
}
