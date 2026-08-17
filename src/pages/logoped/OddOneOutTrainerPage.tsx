import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { oddOneOutTasks } from "@/data/oddOneOutTrainer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { TrainerStatsBar } from "@/components/app/TrainerStatsBar";
import { TrainerAdvanceButton } from "@/components/app/TrainerAdvanceButton";
import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

type WordUi = "idle" | "ok" | "bad" | "disabled";

export default function OddOneOutTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = oddOneOutTasks[taskIndex];

  const [wordUi, setWordUi] = useState<Record<string, WordUi>>({});
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [taskComplete, setTaskComplete] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    setWordUi({});
    setAttemptsUsed(0);
    setTaskComplete(false);
    setShowCheck(false);
  }, [taskIndex]);

  const isLastTask = taskIndex === oddOneOutTasks.length - 1;

  function finishTask() {
    setWordUi((prev) => ({ ...prev, [task.correctWord]: "ok" }));
    setTaskComplete(true);
  }

  function onWordClick(word: string) {
    if (taskComplete || wordUi[word] === "disabled") return;

    if (word === task.correctWord) {
      setCorrectCount((c) => c + 1);
      setWordUi((prev) => ({ ...prev, [word]: "ok" }));
      setShowCheck(true);
      window.setTimeout(() => setShowCheck(false), 900);
      setTaskComplete(true);
      return;
    }

    setIncorrectCount((c) => c + 1);
    setWordUi((prev) => ({ ...prev, [word]: "disabled" }));
    const nextAttempts = attemptsUsed + 1;
    setAttemptsUsed(nextAttempts);
    if (nextAttempts >= 2) {
      finishTask();
    }
  }

  function handleNextTask() {
    if (!taskComplete || isLastTask) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  return (
    <div className="relative mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-1 gap-1.5"
          render={<Link to="/logoped/exercise-bank" />}
        >
          <ArrowLeft className="size-4" /> Банк упражнений
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">4 лишний</h1>
        <p className="text-sm text-muted-foreground">Выберите лишнее слово</p>
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
                {oddOneOutTasks.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {oddOneOutTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <p className="text-sm font-medium text-muted-foreground">Упражнение {task.id}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {task.words.map((word) => {
              const ui = wordUi[word] ?? "idle";
              return (
                <Button
                  key={word}
                  type="button"
                  variant="secondary"
                  disabled={ui === "disabled" || taskComplete}
                  className={cn(
                    "h-auto rounded-xl border-2 px-5 py-3 text-base font-medium",
                    ui === "ok" && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                    ui === "bad" && "border-destructive bg-destructive/10",
                    ui === "disabled" && "border-destructive bg-destructive/10 opacity-60",
                    ui === "idle" && "border-transparent",
                  )}
                  onClick={() => onWordClick(word)}
                >
                  {word}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {taskComplete && (
        <TrainerAdvanceButton isLast={isLastTask} onNext={handleNextTask} onFinish={handleFinish} />
      )}

      {showCheck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex size-24 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 className="size-12" />
          </div>
        </div>
      )}
    </div>
  );
}
