import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { pictureWordTasks, whatIsItAudioUrl, type PictureWord } from "@/data/pictureAndWordTrainer";
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

const MAX_WRONG_BEFORE_SKIP = 3;
type Stage = "yesno" | "pickWord";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function PictureAndWordTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [level, setLevel] = useState<1 | 2>(1);
  const [taskIndex, setTaskIndex] = useState(0);
  const task = pictureWordTasks[taskIndex];
  const allowedWords = useMemo(() => (level === 1 ? task.words.slice(0, 2) : task.words.slice(0, 3)), [task, level]);

  const [imageWord, setImageWord] = useState<PictureWord | null>(null);
  const [audioWord, setAudioWord] = useState<PictureWord | null>(null);
  const [stage, setStage] = useState<Stage>("yesno");
  const [hasListened, setHasListened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [imageLabel, setImageLabel] = useState<string | null>(null);
  const [pickWordLabel, setPickWordLabel] = useState<string | null>(null);
  const [shuffledWords, setShuffledWords] = useState<PictureWord[]>([]);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const taskWrongAttemptsRef = useRef(0);

  function initTaskState() {
    setImageWord(pickRandom(allowedWords));
    setAudioWord(pickRandom(allowedWords));
    setStage("yesno");
    setHasListened(false);
    setIsPlaying(false);
    setFeedback(null);
    taskWrongAttemptsRef.current = 0;
    setReadyToProceed(false);
    setImageLabel(null);
    setPickWordLabel(null);
    setShuffledWords(shuffleArray(allowedWords));
    audioRef.current?.pause();
    audioRef.current = null;
  }

  useEffect(() => {
    initTaskState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIndex, level]);

  const isLast = taskIndex === pictureWordTasks.length - 1;

  function handleLevelChange(next: 1 | 2) {
    setLevel(next);
    setTaskIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
  }

  function showVerdict(isCorrect: boolean) {
    setFeedback(isCorrect ? "correct" : "incorrect");
    window.setTimeout(() => setFeedback(null), 900);
  }

  function registerWrongAnswer() {
    setIncorrectCount((c) => c + 1);
    showVerdict(false);
    taskWrongAttemptsRef.current += 1;
    if (taskWrongAttemptsRef.current >= MAX_WRONG_BEFORE_SKIP) setReadyToProceed(true);
  }

  function completeTaskAfterCorrect(opts: { imageLabel?: string; pickWordLabel?: string }) {
    if (opts.imageLabel) setImageLabel(opts.imageLabel);
    if (opts.pickWordLabel) setPickWordLabel(opts.pickWordLabel);
    showVerdict(true);
    setReadyToProceed(true);
  }

  function onListenClick() {
    if (isPlaying || readyToProceed) return;
    setIsPlaying(true);
    audioRef.current?.pause();

    if (stage === "pickWord") {
      if (!whatIsItAudioUrl) {
        window.setTimeout(() => setIsPlaying(false), 500);
        return;
      }
      audioRef.current = playAudioOrSpeak(whatIsItAudioUrl, "Что это?", () => setIsPlaying(false));
      return;
    }

    if (!audioWord) return;
    if (!audioWord.audioUrl) {
      setIsPlaying(false);
      setHasListened(true);
      return;
    }
    audioRef.current = playAudioOrSpeak(audioWord.audioUrl, audioWord.text, () => setIsPlaying(false));
    setHasListened(true);
  }

  function onYesNo(saidYes: boolean) {
    if (!imageWord || !audioWord || readyToProceed) return;
    const match = imageWord.id === audioWord.id;
    const isCorrect = match ? saidYes : !saidYes;

    if (!isCorrect) {
      registerWrongAnswer();
      return;
    }

    setCorrectCount((c) => c + 1);

    if (level === 2 && !saidYes) {
      setStage("pickWord");
      setHasListened(false);
      showVerdict(true);
      return;
    }

    completeTaskAfterCorrect({ imageLabel: imageWord.text });
  }

  function onPickWord(word: PictureWord) {
    if (!imageWord || readyToProceed) return;
    if (word.id === imageWord.id) {
      setCorrectCount((c) => c + 1);
      completeTaskAfterCorrect({ pickWordLabel: word.text });
      return;
    }
    registerWrongAnswer();
  }

  function handleNextTask() {
    if (!readyToProceed) return;
    if (isLast) {
      handleFinish();
      return;
    }
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  const yesNoDisabled = !hasListened || isPlaying || readyToProceed || stage !== "yesno";

  if (!imageWord) return null;

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
        <h1 className="text-2xl font-semibold text-foreground">Картинка и слово</h1>
        <p className="text-sm text-muted-foreground">
          Слушайте слово и отвечайте «да/нет», соответствует ли оно картинке
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
                <SelectValue>{() => String(task.id)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {pictureWordTasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {pictureWordTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-4">
        <div className="flex aspect-square w-48 items-center justify-center overflow-hidden rounded-xl bg-muted/30">
          {imageWord.imageUrl ? (
            <img src={imageWord.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="p-2 text-center text-sm text-muted-foreground">{imageWord.text}</span>
          )}
        </div>
        {imageLabel && <div className="text-lg font-semibold text-foreground">{imageLabel}</div>}

        <Button
          type="button"
          size="lg"
          className={cn("gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600", isPlaying && "animate-pulse")}
          disabled={isPlaying || readyToProceed}
          onClick={onListenClick}
        >
          Послушайте 🔊
        </Button>

        {stage === "yesno" && (
          <div className="flex gap-3">
            <Button type="button" size="lg" disabled={yesNoDisabled} onClick={() => onYesNo(true)}>
              Да
            </Button>
            <Button type="button" size="lg" variant="secondary" disabled={yesNoDisabled} onClick={() => onYesNo(false)}>
              Нет
            </Button>
          </div>
        )}

        {stage === "pickWord" &&
          (pickWordLabel ? (
            <div className="text-lg font-semibold text-foreground">Это {pickWordLabel}</div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {shuffledWords.map((w) => (
                <Button
                  key={w.id}
                  type="button"
                  variant="secondary"
                  disabled={readyToProceed}
                  className="h-auto rounded-full px-4 py-2 text-sm font-medium"
                  onClick={() => onPickWord(w)}
                >
                  Это {w.text}
                </Button>
              ))}
            </div>
          ))}
      </div>

      {readyToProceed && (
        <div className="flex justify-center">
          <Button type="button" size="lg" className="rounded-full" onClick={handleNextTask}>
            {isLast ? "Завершить тренажёр" : "Дальше →"}
          </Button>
        </div>
      )}

      <TrainerCompletionOverlay variant={feedback} />
    </div>
  );
}
