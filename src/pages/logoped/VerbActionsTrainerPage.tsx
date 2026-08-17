import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verbActionTasks } from "@/data/verbActionsTrainer";
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
import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";
import { shuffleArray, playAudioOrSpeak } from "@/lib/trainer";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

type CardUi = "idle" | "ok" | "bad";
type Stage = "pickImage" | "pickWord";

export default function VerbActionsTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [level, setLevel] = useState<1 | 2>(1);
  const [taskIndex, setTaskIndex] = useState(0);
  const task = verbActionTasks[taskIndex];

  const [targetIdx, setTargetIdx] = useState<0 | 1>(0);
  const [stage, setStage] = useState<Stage>("pickImage");
  const [hasListened, setHasListened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cardUi, setCardUi] = useState<[CardUi, CardUi]>(["idle", "idle"]);
  const [revealedWord, setRevealedWord] = useState<[string | null, string | null]>([null, null]);
  const [variantOptions, setVariantOptions] = useState<string[]>([]);
  const [variantFlash, setVariantFlash] = useState<{ text: string; kind: "ok" | "bad" } | null>(null);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [popup, setPopup] = useState<"correct" | "incorrect" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTargetIdx(Math.random() < 0.5 ? 0 : 1);
    setStage("pickImage");
    setHasListened(false);
    setIsPlaying(false);
    setCardUi(["idle", "idle"]);
    setRevealedWord([null, null]);
    setVariantOptions([]);
    setVariantFlash(null);
    setReadyToProceed(false);
    setPopup(null);
    audioRef.current?.pause();
    audioRef.current = null;
    window.speechSynthesis?.cancel();
  }, [taskIndex, level]);

  const isLastTask = taskIndex === verbActionTasks.length - 1;
  const otherIdx: 0 | 1 = targetIdx === 0 ? 1 : 0;

  function handleListen() {
    if (isPlaying || readyToProceed || stage === "pickWord") return;
    setIsPlaying(true);
    audioRef.current?.pause();
    const targetWord = task.words[targetIdx];
    if (!targetWord.audioUrl) {
      window.setTimeout(() => {
        setIsPlaying(false);
        setHasListened(true);
      }, 500);
      return;
    }
    audioRef.current = playAudioOrSpeak(targetWord.audioUrl, targetWord.word, () => {
      setIsPlaying(false);
      setHasListened(true);
    });
  }

  function handlePickImage(idx: 0 | 1) {
    if (!hasListened || isPlaying || readyToProceed || stage !== "pickImage" || cardUi[idx] !== "idle") return;
    const isCorrect = idx === targetIdx;

    if (!isCorrect) {
      setIncorrectCount((c) => c + 1);
      setCardUi((prev) => {
        const next = [...prev] as [CardUi, CardUi];
        next[idx] = "bad";
        return next;
      });
      window.setTimeout(() => {
        setCardUi((prev) => {
          const next = [...prev] as [CardUi, CardUi];
          if (next[idx] === "bad") next[idx] = "idle";
          return next;
        });
      }, 750);
      return;
    }

    setCorrectCount((c) => c + 1);
    setCardUi((prev) => {
      const next = [...prev] as [CardUi, CardUi];
      next[idx] = "ok";
      return next;
    });

    window.setTimeout(() => {
      if (level === 1) {
        setPopup("correct");
        window.setTimeout(() => setPopup(null), 450);
        setReadyToProceed(true);
        return;
      }
      setRevealedWord((prev) => {
        const next = [...prev] as [string | null, string | null];
        next[idx] = task.words[idx].word;
        return next;
      });
      setVariantOptions(shuffleArray(task.words[otherIdx].variants));
      setStage("pickWord");
    }, 550);
  }

  function handlePickVariant(text: string) {
    if (stage !== "pickWord" || readyToProceed) return;
    const otherWord = task.words[otherIdx];
    const isCorrect = text === otherWord.word;

    if (!isCorrect) {
      setIncorrectCount((c) => c + 1);
      setVariantFlash({ text, kind: "bad" });
      window.setTimeout(() => setVariantFlash(null), 700);
      return;
    }

    setCorrectCount((c) => c + 1);
    setVariantFlash({ text, kind: "ok" });
    setRevealedWord((prev) => {
      const next = [...prev] as [string | null, string | null];
      next[otherIdx] = otherWord.word;
      return next;
    });
    window.setTimeout(() => {
      setVariantFlash(null);
      setPopup("correct");
      window.setTimeout(() => setPopup(null), 450);
      setReadyToProceed(true);
    }, 450);
  }

  function handleLevelChange(next: 1 | 2) {
    setLevel(next);
    setTaskIndex(0);
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
        <h1 className="text-2xl font-semibold text-foreground">Действия</h1>
        <p className="text-sm text-muted-foreground">
          Две картинки: послушайте слово и выберите действие. Уровень 2 — затем угадайте слово по
          второй картинке.
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Уровень</Label>
            <Select value={String(level)} onValueChange={(v) => v && handleLevelChange(Number(v) as 1 | 2)}>
              <SelectTrigger className="w-28">
                <SelectValue>{() => `Уровень ${level}`}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Уровень 1</SelectItem>
                <SelectItem value="2">Уровень 2</SelectItem>
              </SelectContent>
            </Select>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(taskIndex)} onValueChange={(v) => v && setTaskIndex(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(taskIndex + 1)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {verbActionTasks.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {verbActionTasks.length}</span>
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
          disabled={isPlaying || readyToProceed || stage === "pickWord"}
          onClick={handleListen}
        >
          Послушайте 🔊
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {task.words.map((word, idx) => {
          const ui = cardUi[idx as 0 | 1];
          const label = revealedWord[idx as 0 | 1];
          return (
            <button
              key={word.id}
              type="button"
              disabled={stage !== "pickImage" || ui !== "idle" || !hasListened || isPlaying}
              onClick={() => handlePickImage(idx as 0 | 1)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border-2 p-3 shadow-sm",
                ui === "ok" && "border-emerald-500 ring-4 ring-emerald-400",
                ui === "bad" && "border-destructive ring-4 ring-destructive/60",
                ui === "idle" && "border-border",
              )}
            >
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                {word.imageUrl ? (
                  <img src={word.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="p-2 text-center text-xs text-muted-foreground">{word.word}</span>
                )}
              </div>
              {label && (
                <span className="rounded-md bg-emerald-100 px-2 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {stage === "pickWord" && !readyToProceed && (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">А здесь?</div>
          <div className="flex flex-wrap justify-center gap-2">
            {variantOptions.map((text) => (
              <Button
                key={text}
                type="button"
                variant={variantFlash?.text === text ? "default" : "secondary"}
                className={cn(
                  "h-auto rounded-full px-4 py-2 text-sm font-medium",
                  variantFlash?.text === text && variantFlash.kind === "ok" && "bg-emerald-500 hover:bg-emerald-600",
                  variantFlash?.text === text && variantFlash.kind === "bad" && "bg-destructive hover:bg-destructive/90",
                )}
                onClick={() => handlePickVariant(text)}
              >
                {text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {readyToProceed && (
        <div className="flex justify-center">
          <Button type="button" size="lg" className="rounded-full" onClick={isLastTask ? handleFinish : handleNextTask}>
            {isLastTask ? "Завершить тренажёр" : "Дальше →"}
          </Button>
        </div>
      )}

      <TrainerCompletionOverlay variant={popup} />
    </div>
  );
}
