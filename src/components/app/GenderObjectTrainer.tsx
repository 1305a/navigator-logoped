import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { GenderItem, GenderTask } from "@/data/genderMasculineTrainer";
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
import { shuffleArray, playAudioOrSpeak } from "@/lib/trainer";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const MAX_WRONG = 3;

export interface GenderObjectTrainerProps {
  title: string;
  description: string;
  items: GenderItem[];
  tasks: GenderTask[];
}

export function GenderObjectTrainer({ title, description, items, tasks }: GenderObjectTrainerProps) {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = tasks[taskIndex];

  const [grid, setGrid] = useState<GenderItem[]>([]);
  const [audioLocked, setAudioLocked] = useState(false);
  const [feedback, setFeedback] = useState<{ id: number; kind: "ok" | "bad" } | null>(null);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [popup, setPopup] = useState<"correct" | "incorrect" | null>(null);
  const [wrongCount, setWrongCount] = useState(0);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setGrid(shuffleArray(items));
    setAudioLocked(false);
    setFeedback(null);
    setReadyToProceed(false);
    setPopup(null);
    setWrongCount(0);
    audioRef.current?.pause();
    audioRef.current = null;
    window.speechSynthesis?.cancel();
  }, [taskIndex, items]);

  const isLast = taskIndex === tasks.length - 1;

  function playTaskAudio() {
    if (!task || audioLocked) return;
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    setAudioLocked(true);
    const url = task.audioUrl;
    if (!url) {
      window.setTimeout(() => setAudioLocked(false), 700);
      return;
    }
    audioRef.current = playAudioOrSpeak(url, task.instruction, () => setAudioLocked(false));
  }

  function handlePick(item: GenderItem) {
    if (!task || audioLocked || feedback || readyToProceed) return;
    if (item.id === task.correctItemId) {
      setFeedback({ id: item.id, kind: "ok" });
      setCorrectCount((c) => c + 1);
      window.setTimeout(() => {
        setFeedback(null);
        setPopup("correct");
        window.setTimeout(() => setPopup(null), 450);
        setReadyToProceed(true);
      }, 550);
      return;
    }

    setIncorrectCount((c) => c + 1);
    setFeedback({ id: item.id, kind: "bad" });
    const nextWrong = wrongCount + 1;
    setWrongCount(nextWrong);
    window.setTimeout(() => {
      setFeedback(null);
      if (nextWrong >= MAX_WRONG) {
        setPopup("incorrect");
        window.setTimeout(() => setPopup(null), 450);
        setReadyToProceed(true);
      }
    }, 550);
  }

  function handleNextTask() {
    if (!readyToProceed || isLast) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

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
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
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
                {tasks.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {tasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex justify-center">
        <Button
          type="button"
          size="lg"
          className={cn(
            "gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600",
            audioLocked && "animate-pulse",
          )}
          disabled={Boolean(audioLocked || feedback || readyToProceed)}
          onClick={playTaskAudio}
        >
          Послушайте 🔊
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {grid.map((item) => {
          const fb = feedback?.id === item.id ? feedback.kind : null;
          return (
            <button
              key={item.id}
              type="button"
              disabled={Boolean(audioLocked || feedback || readyToProceed)}
              onClick={() => handlePick(item)}
              className={cn(
                "relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border-2 bg-card p-2 shadow-sm transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-70",
                fb === "ok" && "border-emerald-500 ring-4 ring-emerald-400",
                fb === "bad" && "border-destructive ring-4 ring-destructive/60",
                !fb && "border-border",
              )}
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="p-2 text-center text-sm font-semibold text-foreground">{item.word}</span>
              )}
            </button>
          );
        })}
      </div>

      {readyToProceed && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextTask} onFinish={handleFinish} />
      )}

      <TrainerCompletionOverlay variant={popup} />
    </div>
  );
}
