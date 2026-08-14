import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verbImageTasks, type VerbActionOption } from "@/data/verbToImageTrainer";
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
import { cn } from "@/lib/utils";
import { ArrowLeft, Image as ImageIcon, Volume2 } from "lucide-react";

type View = "level1" | "level2";
type Level2Stage = "yesno" | "pickAction";

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function allowedActions(task: (typeof verbImageTasks)[number], view: View) {
  return view === "level1" ? task.actions.slice(0, 2) : task.actions.slice(0, 3);
}

async function playSequential(audio: HTMLAudioElement, urls: Array<string | undefined>) {
  for (const url of urls) {
    if (!url) continue;
    await new Promise<void>((resolve) => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = url;
      const done = () => resolve();
      audio.addEventListener("ended", done, { once: true });
      audio.addEventListener("error", done, { once: true });
      audio.play().catch(() => resolve());
    });
  }
}

export default function VerbToImageTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [view, setView] = useState<View>("level1");
  const [taskIndex, setTaskIndex] = useState(0);
  const task = verbImageTasks[taskIndex];

  const [pickedAction, setPickedAction] = useState<VerbActionOption | null>(null);
  const [level2Stage, setLevel2Stage] = useState<Level2Stage>("yesno");
  const [level2PickSolved, setLevel2PickSolved] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answerAttempt, setAnswerAttempt] = useState(0);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const correctAction = useMemo(() => task.actions.find((a) => a.isCorrect) ?? task.actions[0], [task]);

  useEffect(() => {
    setReadyToProceed(false);
    setFeedback(null);
    setHasListened(false);
    setLevel2Stage("yesno");
    setLevel2PickSolved(false);
    setIsPlaying(false);
    setAnswerAttempt(0);
    setPickedAction(pickRandom(allowedActions(task, view)));
  }, [task, view]);

  const isLast = taskIndex === verbImageTasks.length - 1;

  async function onListenClick() {
    if (readyToProceed || isPlaying) return;
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(true);
    if (view === "level2" && level2Stage === "pickAction") {
      await playSequential(audio, [task.word.audioUrl]);
    } else {
      await playSequential(audio, [task.word.audioUrl, pickedAction?.audioUrl]);
      setHasListened(true);
    }
    setIsPlaying(false);
  }

  function showVerdict(isCorrect: boolean) {
    setFeedback(isCorrect ? "correct" : "incorrect");
    window.setTimeout(() => setFeedback(null), 900);
  }

  function onYesNo(answer: "yes" | "no") {
    if (readyToProceed || !pickedAction || isPlaying) return;
    if (!hasListened) return;

    const actionIsCorrect = pickedAction.isCorrect;
    const isYes = answer === "yes";
    const isCorrect = actionIsCorrect ? isYes : !isYes;
    const toPickAction = view === "level2" && !actionIsCorrect && answer === "no" && isCorrect;

    if (toPickAction) {
      setCorrectCount((c) => c + 1);
      setLevel2Stage("pickAction");
      setLevel2PickSolved(false);
      setAnswerAttempt(0);
      return;
    }

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      showVerdict(true);
      setReadyToProceed(true);
      return;
    }

    setIncorrectCount((c) => c + 1);
    showVerdict(false);
    if (answerAttempt === 0) {
      setAnswerAttempt(1);
      return;
    }
    setReadyToProceed(true);
  }

  function onPickAction(action: VerbActionOption) {
    if (readyToProceed) return;
    if (action.isCorrect) {
      setCorrectCount((c) => c + 1);
      setLevel2PickSolved(true);
      showVerdict(true);
      setReadyToProceed(true);
      return;
    }
    setIncorrectCount((c) => c + 1);
    showVerdict(false);
    if (answerAttempt === 0) {
      setAnswerAttempt(1);
      return;
    }
    setReadyToProceed(true);
  }

  function handleNextTask() {
    if (taskIndex >= verbImageTasks.length - 1) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  const yesNoDisabled = readyToProceed || isPlaying || !hasListened;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <audio ref={audioRef} />
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-1 gap-1.5"
          render={<Link to="/logoped/exercise-bank" />}
        >
          <ArrowLeft className="size-4" /> Банк упражнений
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Глагол к картинке</h1>
        <p className="text-sm text-muted-foreground">
          Прослушайте слово и действие, ответьте «да» или «нет»
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Уровень</Label>
            <Select
              value={view}
              onValueChange={(v) => v && setView(v as View)}
            >
              <SelectTrigger className="w-32">
                <SelectValue>{() => (view === "level1" ? "Уровень 1" : "Уровень 2")}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="level1">Уровень 1</SelectItem>
                <SelectItem value="level2">Уровень 2</SelectItem>
              </SelectContent>
            </Select>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(taskIndex)} onValueChange={(v) => v && setTaskIndex(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(task.id)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {verbImageTasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {verbImageTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <p className="text-center text-lg font-semibold text-foreground">Ответьте на вопрос</p>

      <div className="flex justify-center">
        <Button
          type="button"
          onClick={onListenClick}
          disabled={readyToProceed}
          className={cn(
            "gap-2 rounded-full bg-emerald-600 px-8 text-white hover:bg-emerald-600/90",
            isPlaying && "animate-pulse",
          )}
        >
          Послушайте <Volume2 className="size-5" />
        </Button>
      </div>

      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border bg-muted/40">
        {task.imageUrl ? (
          <img src={task.imageUrl} alt="" className="h-full w-full object-contain" />
        ) : (
          <ImageIcon className="size-12 text-muted-foreground" />
        )}
      </div>

      {view === "level2" && level2Stage === "pickAction" ? (
        <div
          className={cn(
            "rounded-2xl border p-4",
            level2PickSolved && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
          )}
        >
          {level2PickSolved ? (
            <p className="text-center text-lg font-medium text-foreground">
              {task.word.text} {correctAction?.text}
            </p>
          ) : (
            <>
              <p className="mb-3 text-center text-lg font-semibold text-foreground">
                {task.word.text}...
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {task.actions.slice(0, 3).map((action) => (
                  <Button
                    key={action.text}
                    type="button"
                    variant="secondary"
                    className="h-auto rounded-full px-5 py-2.5 text-base font-medium"
                    disabled={readyToProceed}
                    onClick={() => onPickAction(action)}
                  >
                    {action.text}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex justify-center gap-3">
          <Button
            type="button"
            disabled={yesNoDisabled}
            onClick={() => onYesNo("yes")}
            className="h-14 w-32 rounded-2xl bg-emerald-600 text-lg font-bold text-white hover:bg-emerald-600/90"
          >
            Да
          </Button>
          <Button
            type="button"
            disabled={yesNoDisabled}
            onClick={() => onYesNo("no")}
            className="h-14 w-32 rounded-2xl bg-destructive text-lg font-bold text-white hover:bg-destructive/90"
          >
            Нет
          </Button>
        </div>
      )}

      {readyToProceed && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextTask} onFinish={handleFinish} />
      )}

      <TrainerCompletionOverlay variant={feedback} />
    </div>
  );
}
