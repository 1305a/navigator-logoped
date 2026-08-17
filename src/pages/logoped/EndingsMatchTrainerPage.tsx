import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { endingTasks } from "@/data/endingsMatchTrainer";
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

interface EndingOption {
  id: string;
  label: string;
  phraseId: string;
}

export default function EndingsMatchTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = endingTasks[taskIndex];

  const [endingOptions, setEndingOptions] = useState<EndingOption[]>([]);
  const [usedOptionIds, setUsedOptionIds] = useState<Set<string>>(new Set());
  const [selectedEndingId, setSelectedEndingId] = useState<string | null>(null);
  const [selectedBlankId, setSelectedBlankId] = useState<string | null>(null);
  const [filled, setFilled] = useState<Record<string, string>>({});
  const [flashPhraseId, setFlashPhraseId] = useState<string | null>(null);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const taskHadErrorRef = useRef(false);

  useEffect(() => {
    setEndingOptions(
      shuffleArray(task.phrases.map((p) => ({ id: `opt-${p.id}`, label: p.correctEnding, phraseId: p.id }))),
    );
    setUsedOptionIds(new Set());
    setSelectedEndingId(null);
    setSelectedBlankId(null);
    setFilled({});
    setFlashPhraseId(null);
    setReadyToProceed(false);
    setFeedback(null);
    taskHadErrorRef.current = false;
  }, [taskIndex, task]);

  const isLastTask = taskIndex === endingTasks.length - 1;
  const isTaskComplete = task.phrases.every((p) => !!filled[p.id]);

  useEffect(() => {
    if (!isTaskComplete || readyToProceed) return;
    window.setTimeout(() => {
      if (taskHadErrorRef.current) setIncorrectCount((c) => c + 1);
      else setCorrectCount((c) => c + 1);
      setFeedback(taskHadErrorRef.current ? "incorrect" : "correct");
      window.setTimeout(() => setFeedback(null), 900);
      setReadyToProceed(true);
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTaskComplete]);

  function attemptMatch(phraseId: string, optionId: string) {
    const option = endingOptions.find((o) => o.id === optionId);
    if (!option) return;

    if (option.phraseId === phraseId) {
      setFilled((prev) => ({ ...prev, [phraseId]: option.label }));
      setUsedOptionIds((prev) => new Set(prev).add(optionId));
      setSelectedEndingId(null);
      setSelectedBlankId(null);
      return;
    }

    taskHadErrorRef.current = true;
    setFlashPhraseId(phraseId);
    window.setTimeout(() => setFlashPhraseId((prev) => (prev === phraseId ? null : prev)), 500);
    setSelectedEndingId(null);
    setSelectedBlankId(null);
  }

  function handleEndingClick(optionId: string) {
    if (isTaskComplete || usedOptionIds.has(optionId)) return;
    if (selectedBlankId) {
      attemptMatch(selectedBlankId, optionId);
      return;
    }
    setSelectedEndingId((prev) => (prev === optionId ? null : optionId));
    setSelectedBlankId(null);
  }

  function handleBlankClick(phraseId: string) {
    if (isTaskComplete || filled[phraseId]) return;
    if (selectedEndingId) {
      attemptMatch(phraseId, selectedEndingId);
      return;
    }
    setSelectedBlankId((prev) => (prev === phraseId ? null : phraseId));
    setSelectedEndingId(null);
  }

  function handleNextTask() {
    if (!readyToProceed || isLastTask) return;
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
        <h1 className="text-2xl font-semibold text-foreground">Расставьте окончания</h1>
        <p className="text-sm text-muted-foreground">Вставьте подходящее окончание</p>
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
                {endingTasks.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {endingTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {endingOptions.map((o) => {
          const used = usedOptionIds.has(o.id);
          if (used) return null;
          return (
            <Button
              key={o.id}
              type="button"
              variant={selectedEndingId === o.id ? "default" : "secondary"}
              className={cn(
                "h-auto rounded-lg px-4 py-2 text-lg font-medium",
                selectedBlankId && selectedEndingId !== o.id && "ring-2 ring-primary/40",
              )}
              disabled={isTaskComplete}
              onClick={() => handleEndingClick(o.id)}
            >
              {o.label}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        {task.phrases.map((p) => {
          const value = filled[p.id];
          const isFlashing = flashPhraseId === p.id;
          const isSelectedBlank = selectedBlankId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              disabled={isTaskComplete || !!value}
              onClick={() => handleBlankClick(p.id)}
              className={cn(
                "flex flex-wrap items-center gap-2 rounded-xl border p-3 text-left text-base text-foreground",
                value && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                isFlashing && "border-destructive bg-destructive/10",
                !value && !isFlashing && isSelectedBlank && "border-primary bg-primary/10",
                !value &&
                  !isFlashing &&
                  !isSelectedBlank &&
                  selectedEndingId &&
                  "border-primary/40 ring-2 ring-primary/30",
                !value && !isFlashing && !isSelectedBlank && !selectedEndingId && "border-border bg-card",
              )}
            >
              <span>{p.before}</span>
              <span
                className={cn(
                  "min-w-12 rounded-lg border-2 px-2 py-0.5 text-center font-semibold",
                  value && "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
                  !value && "border-dashed border-muted-foreground/40",
                )}
              >
                {value ?? "___"}
              </span>
              <span>{p.after}</span>
            </button>
          );
        })}
      </div>

      {readyToProceed && (
        <TrainerAdvanceButton isLast={isLastTask} onNext={handleNextTask} onFinish={handleFinish} />
      )}

      <TrainerCompletionOverlay variant={feedback} />
    </div>
  );
}
