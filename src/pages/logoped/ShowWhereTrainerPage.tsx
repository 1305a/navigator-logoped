import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { showWhereSets } from "@/data/showWhereTrainer";
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
import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";
import { shuffleArray, playAudioOrSpeak } from "@/lib/trainer";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const MAX_WRONG = 3;
type Pass = "main" | "retry";

export default function ShowWhereTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [level, setLevel] = useState<1 | 2>(1);
  const [taskIndex, setTaskIndex] = useState(0);
  const set = showWhereSets[taskIndex];
  const pool = useMemo(() => (level === 1 ? set.words.slice(0, 4) : set.words.slice(0, 6)), [set, level]);

  const [queue, setQueue] = useState<number[]>([]);
  const [pass, setPass] = useState<Pass>("main");
  const [retryBuffer, setRetryBuffer] = useState<number[]>([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [grid, setGrid] = useState(pool);
  const [audioLocked, setAudioLocked] = useState(true);
  const [feedback, setFeedback] = useState<{ id: number; kind: "ok" | "bad" } | null>(null);
  const [readyToProceed, setReadyToProceed] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function resetSession() {
    setQueue(pool.map((_, i) => i));
    setPass("main");
    setRetryBuffer([]);
    setWrongCount(0);
    setGrid(shuffleArray(pool));
    setAudioLocked(true);
    setFeedback(null);
    setReadyToProceed(false);
    audioRef.current?.pause();
    audioRef.current = null;
  }

  useEffect(() => {
    resetSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIndex, level]);

  const isLast = taskIndex === showWhereSets.length - 1;
  const target = queue.length > 0 ? pool[queue[0]] : null;

  useEffect(() => {
    if (!target || readyToProceed) return;
    audioRef.current?.pause();
    setAudioLocked(true);
    setGrid(shuffleArray(pool));
    if (!target.audioUrl) {
      window.setTimeout(() => setAudioLocked(false), 400);
      return;
    }
    audioRef.current = playAudioOrSpeak(target.audioUrl, target.text, () => setAudioLocked(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.id]);

  useEffect(() => {
    if (queue.length > 0) return;
    if (pass === "main" && retryBuffer.length > 0) {
      setPass("retry");
      setQueue([...retryBuffer]);
      setRetryBuffer([]);
      setWrongCount(0);
    } else if (readyToProceed === false && pool.length > 0) {
      setReadyToProceed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, pass]);

  function handleReplay() {
    if (!target || audioLocked || feedback || readyToProceed) return;
    audioRef.current?.pause();
    setAudioLocked(true);
    if (!target.audioUrl) {
      window.setTimeout(() => setAudioLocked(false), 400);
      return;
    }
    audioRef.current = playAudioOrSpeak(target.audioUrl, target.text, () => setAudioLocked(false));
  }

  function handlePick(id: number) {
    if (!target || audioLocked || feedback || readyToProceed) return;

    if (id === target.id) {
      setCorrectCount((c) => c + 1);
      setFeedback({ id, kind: "ok" });
      window.setTimeout(() => {
        setFeedback(null);
        setQueue((q) => q.slice(1));
        setWrongCount(0);
      }, 550);
      return;
    }

    setIncorrectCount((c) => c + 1);
    setFeedback({ id, kind: "bad" });
    const nextWrong = wrongCount + 1;
    setWrongCount(nextWrong);
    window.setTimeout(() => {
      setFeedback(null);
      if (nextWrong >= MAX_WRONG) {
        const failedIdx = queue[0];
        setQueue((q) => q.slice(1));
        setWrongCount(0);
        if (pass === "main") setRetryBuffer((b) => [...b, failedIdx]);
      }
    }, 550);
  }

  function handleLevelChange(next: 1 | 2) {
    setLevel(next);
    setTaskIndex(0);
  }

  function handleNextTask() {
    if (!readyToProceed || isLast) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  const gridCols = pool.length === 6 ? "sm:grid-cols-3" : "sm:grid-cols-2";

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
        <h1 className="text-2xl font-semibold text-foreground">Покажите, где…</h1>
        <p className="text-sm text-muted-foreground">Прослушайте слово и выберите соответствующую картинку</p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Уровень</Label>
            <Select value={String(level)} onValueChange={(v) => v && handleLevelChange(Number(v) as 1 | 2)}>
              <SelectTrigger className="w-32">
                <SelectValue>{() => `Уровень ${level} (${level === 1 ? 4 : 6})`}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Уровень 1 (4 слова)</SelectItem>
                <SelectItem value="2">Уровень 2 (6 слов)</SelectItem>
              </SelectContent>
            </Select>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(taskIndex)} onValueChange={(v) => v && setTaskIndex(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(taskIndex + 1)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {showWhereSets.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {showWhereSets.length}</span>
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
          className={cn("gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600", audioLocked && "animate-pulse")}
          disabled={Boolean(audioLocked || feedback || readyToProceed)}
          onClick={handleReplay}
        >
          Послушайте 🔊
        </Button>
      </div>

      <div className={cn("grid gap-4 grid-cols-2", gridCols)}>
        {grid.map((item) => {
          const fb = feedback?.id === item.id ? feedback.kind : null;
          return (
            <button
              key={item.id}
              type="button"
              disabled={Boolean(audioLocked || feedback || readyToProceed)}
              onClick={() => handlePick(item.id)}
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
                <span className="p-2 text-center text-sm font-semibold text-foreground">{item.text}</span>
              )}
              {audioLocked && !feedback && (
                <span className="absolute inset-0 flex items-center justify-center bg-background/40 text-xs font-medium text-muted-foreground">
                  Слушайте…
                </span>
              )}
            </button>
          );
        })}
      </div>

      {readyToProceed && (
        <div className="flex justify-center">
          <Button
            type="button"
            size="lg"
            className="rounded-full"
            onClick={isLast ? handleFinish : handleNextTask}
          >
            {isLast ? "Завершить тренажёр" : "Дальше →"}
          </Button>
        </div>
      )}
    </div>
  );
}
