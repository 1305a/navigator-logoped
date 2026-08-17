import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { attributeTasks, type AttributeOption } from "@/data/attributeMatchTrainer";
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
import { playAudioOrSpeak } from "@/lib/trainer";
import { cn } from "@/lib/utils";
import { ArrowLeft, ThumbsDown, ThumbsUp } from "lucide-react";

type Stage = "yesno" | "pickAction";

export default function AttributeMatchTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [level, setLevel] = useState<1 | 2>(1);
  const [taskIndex, setTaskIndex] = useState(0);
  const task = attributeTasks[taskIndex];

  const pool = useMemo(
    () => (level === 1 ? task.actions.slice(0, 2) : task.actions.slice(0, 3)),
    [task, level],
  );
  const [pickedAction, setPickedAction] = useState<AttributeOption>(pool[0]);
  const [stage, setStage] = useState<Stage>("yesno");
  const [hasListened, setHasListened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pickActionFlash, setPickActionFlash] = useState<{ text: string; kind: "ok" | "bad" } | null>(
    null,
  );
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [popup, setPopup] = useState<"correct" | "incorrect" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setPickedAction(pool[Math.floor(Math.random() * pool.length)]);
    setStage("yesno");
    setHasListened(false);
    setIsPlaying(false);
    setPickActionFlash(null);
    setReadyToProceed(false);
    setPopup(null);
    audioRef.current?.pause();
    audioRef.current = null;
    window.speechSynthesis?.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIndex, level]);

  const isLastTask = taskIndex === attributeTasks.length - 1;

  function handleListenYesNo() {
    if (isPlaying || readyToProceed) return;
    setIsPlaying(true);
    audioRef.current?.pause();
    const playAction = () => {
      if (!pickedAction.audioUrl) {
        window.setTimeout(() => {
          setIsPlaying(false);
          setHasListened(true);
        }, 400);
        return;
      }
      audioRef.current = playAudioOrSpeak(pickedAction.audioUrl, pickedAction.text, () => {
        setIsPlaying(false);
        setHasListened(true);
      });
    };
    if (!task.word.audioUrl) {
      playAction();
      return;
    }
    audioRef.current = playAudioOrSpeak(task.word.audioUrl, task.word.text, playAction);
  }

  function handleListenWord() {
    if (isPlaying || readyToProceed) return;
    setIsPlaying(true);
    audioRef.current?.pause();
    if (!task.word.audioUrl) {
      window.setTimeout(() => setIsPlaying(false), 400);
      return;
    }
    audioRef.current = playAudioOrSpeak(task.word.audioUrl, task.word.text, () => setIsPlaying(false));
  }

  function onYesNo(saysYes: boolean) {
    if (!hasListened || isPlaying || readyToProceed) return;
    const isAnswerCorrect = saysYes === pickedAction.isCorrect;

    if (level === 2 && !saysYes && !pickedAction.isCorrect && isAnswerCorrect) {
      setCorrectCount((c) => c + 1);
      setStage("pickAction");
      setHasListened(false);
      return;
    }

    if (isAnswerCorrect) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
    setPopup(isAnswerCorrect ? "correct" : "incorrect");
    window.setTimeout(() => setPopup(null), 900);
    setReadyToProceed(true);
  }

  function onPickAction(option: AttributeOption) {
    if (stage !== "pickAction" || readyToProceed) return;
    const isCorrect = option.isCorrect;
    setPickActionFlash({ text: option.text, kind: isCorrect ? "ok" : "bad" });
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
    window.setTimeout(() => {
      setPickActionFlash(null);
      setPopup(isCorrect ? "correct" : "incorrect");
      window.setTimeout(() => setPopup(null), 900);
      setReadyToProceed(true);
    }, 500);
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
        <h1 className="text-2xl font-semibold text-foreground">
          Понимание речи Начало начал ПРИЗНАКИ
        </h1>
        <p className="text-sm text-muted-foreground">
          Прослушайте слово и признак, ответьте «да/нет»; на уровне 2 при необходимости выберите
          правильный признак.
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
                {attributeTasks.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {attributeTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <p className="text-center text-sm text-muted-foreground">
        Послушайте и ответьте «да», если признак подходит к картинке
      </p>

      <div className="flex justify-center">
        <Button
          type="button"
          size="lg"
          className={cn("gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600", isPlaying && "animate-pulse")}
          disabled={isPlaying || readyToProceed}
          onClick={stage === "yesno" ? handleListenYesNo : handleListenWord}
        >
          Послушайте 🔊
        </Button>
      </div>

      <div className="mx-auto flex aspect-square w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl border bg-muted/30">
        {task.imageUrl ? (
          <img src={task.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="p-2 text-center text-sm text-muted-foreground">{task.word.text}</span>
        )}
      </div>

      {stage === "yesno" && (
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            size="lg"
            className="gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-600/90"
            disabled={!hasListened || isPlaying || readyToProceed}
            onClick={() => onYesNo(true)}
          >
            <ThumbsUp className="size-4" /> Да
          </Button>
          <Button
            type="button"
            size="lg"
            variant="destructive"
            className="gap-1.5 rounded-full"
            disabled={!hasListened || isPlaying || readyToProceed}
            onClick={() => onYesNo(false)}
          >
            <ThumbsDown className="size-4" /> Нет
          </Button>
        </div>
      )}

      {stage === "pickAction" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">{task.word.text}…</div>
          <div className="flex flex-wrap justify-center gap-2">
            {task.actions.map((option) => (
              <Button
                key={option.text}
                type="button"
                variant={pickActionFlash?.text === option.text ? "default" : "secondary"}
                disabled={readyToProceed}
                className={cn(
                  "h-auto rounded-full px-4 py-2 text-sm font-medium",
                  pickActionFlash?.text === option.text &&
                    pickActionFlash.kind === "ok" &&
                    "bg-emerald-500 hover:bg-emerald-600",
                  pickActionFlash?.text === option.text &&
                    pickActionFlash.kind === "bad" &&
                    "bg-destructive hover:bg-destructive/90",
                )}
                onClick={() => onPickAction(option)}
              >
                {option.text}
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
