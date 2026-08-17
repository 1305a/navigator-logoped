import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verbNounTasks, type VerbNounPhrase } from "@/data/verbNounPhrasesTrainer";
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
import { playAudioOrSpeak } from "@/lib/trainer";
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function VerbNounPhrasesTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [taskIndex, setTaskIndex] = useState(0);
  const task = verbNounTasks[taskIndex];

  const secondIndex = level === 1 ? 1 : level === 2 ? 2 : 3;
  const choices = useMemo<[VerbNounPhrase, VerbNounPhrase]>(
    () => [task.phrases[0], task.phrases[secondIndex]],
    [task, secondIndex],
  );
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<{ idx: number; kind: "correct" | "incorrect" } | null>(null);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCorrectAnswer(Math.random() < 0.5 ? 0 : 1);
    setHasPlayed(false);
    setIsPlaying(false);
    setResult(null);
    setReadyToProceed(false);
    setShowCheck(false);
    audioRef.current?.pause();
    audioRef.current = null;
    window.speechSynthesis?.cancel();
  }, [taskIndex, level]);

  const isLastTask = taskIndex === verbNounTasks.length - 1;
  const isLastLevel = level === 3;
  const current = choices[correctAnswer];

  function handleListen() {
    if (isPlaying || readyToProceed) return;
    setIsPlaying(true);
    audioRef.current?.pause();
    if (!current.audioUrl) {
      window.setTimeout(() => {
        setIsPlaying(false);
        setHasPlayed(true);
      }, 400);
      return;
    }
    audioRef.current = playAudioOrSpeak(current.audioUrl, current.phrase, () => {
      setIsPlaying(false);
      setHasPlayed(true);
    });
  }

  function handlePick(idx: number) {
    if (!hasPlayed || isPlaying || readyToProceed || result) return;
    if (idx === correctAnswer) {
      setCorrectCount((c) => c + 1);
      setResult({ idx, kind: "correct" });
      setShowCheck(true);
      window.setTimeout(() => {
        setShowCheck(false);
        setReadyToProceed(true);
      }, 900);
      return;
    }
    setIncorrectCount((c) => c + 1);
    setResult({ idx, kind: "incorrect" });
    window.setTimeout(() => setResult(null), 1000);
  }

  function handleLevelChange(next: 1 | 2 | 3) {
    setLevel(next);
    setTaskIndex(0);
  }

  function handleNextTask() {
    if (!readyToProceed) return;
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
        <h1 className="text-2xl font-semibold text-foreground">
          Словосочетания глагол существительное
        </h1>
        <p className="text-sm text-muted-foreground">
          Покажите, где… Послушайте словосочетание и выберите подходящую картинку. Три уровня
          сложности.
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Уровень</Label>
            <Select
              value={String(level)}
              onValueChange={(v) => v && handleLevelChange(Number(v) as 1 | 2 | 3)}
            >
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
                {verbNounTasks.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {verbNounTasks.length}</span>
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
          className={cn("gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600", isPlaying && "animate-pulse")}
          disabled={isPlaying || readyToProceed}
          onClick={handleListen}
        >
          Послушайте 🔊
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {choices.map((phrase, idx) => {
          const r = result?.idx === idx ? result.kind : null;
          return (
            <button
              key={phrase.id}
              type="button"
              disabled={!hasPlayed || isPlaying || readyToProceed}
              onClick={() => handlePick(idx)}
              className={cn(
                "relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border-2 bg-card p-2 shadow-sm transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-70",
                r === "correct" && "border-emerald-500 ring-4 ring-emerald-400",
                r === "incorrect" && "border-destructive ring-4 ring-destructive/60",
                !r && "border-border",
              )}
            >
              {phrase.imageUrl ? (
                <img src={phrase.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="p-2 text-center text-sm font-semibold text-foreground">{phrase.phrase}</span>
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
            onClick={isLastTask && isLastLevel ? handleFinish : handleNextTask}
          >
            {isLastTask && isLastLevel ? "Завершить тренажёр" : "Дальше →"}
          </Button>
        </div>
      )}

      {showCheck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <CheckCircle2 className="size-24 text-emerald-500" />
        </div>
      )}
    </div>
  );
}
