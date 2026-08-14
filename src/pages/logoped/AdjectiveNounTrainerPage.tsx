import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { adjNounTasks } from "@/data/adjectiveNounTrainer";
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
import { ArrowLeft, Volume2 } from "lucide-react";

const LEVEL_SECOND_INDEX: Record<string, number> = { "1": 1, "2": 2, "3": 3 };

export default function AdjectiveNounTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [level, setLevel] = useState("1");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const task = adjNounTasks[currentTaskIndex];

  const levelChoices = useMemo(
    () => [task.phrases[0], task.phrases[LEVEL_SECOND_INDEX[level]]],
    [task, level],
  );

  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [incorrectSlot, setIncorrectSlot] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    setCorrectAnswer(Math.floor(Math.random() * 2));
    setSelectedImage(null);
    setIncorrectSlot(null);
    setFeedback(null);
    setHasPlayedSound(false);
    setReadyToProceed(false);
    setIsPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTaskIndex, level]);

  const isLast = currentTaskIndex === adjNounTasks.length - 1;
  const current = levelChoices[correctAnswer];

  function speak() {
    if (isPlaying || readyToProceed) return;
    setHasPlayedSound(true);
    const audio = audioRef.current;
    if (!audio || !current?.audioUrl) return;
    setIsPlaying(true);
    audio.pause();
    audio.currentTime = 0;
    audio.src = current.audioUrl;
    const clear = () => setIsPlaying(false);
    audio.addEventListener("ended", clear, { once: true });
    audio.addEventListener("error", clear, { once: true });
    audio.play().catch(() => setIsPlaying(false));
  }

  function handleImageClick(index: number) {
    if (selectedImage !== null || isPlaying || !hasPlayedSound) return;
    setSelectedImage(index);
    if (index === correctAnswer) {
      setCorrectCount((c) => c + 1);
      setFeedback("correct");
      window.setTimeout(() => {
        setFeedback(null);
        setReadyToProceed(true);
      }, 900);
    } else {
      setIncorrectCount((c) => c + 1);
      setIncorrectSlot(index);
      setFeedback("incorrect");
      window.setTimeout(() => {
        setFeedback(null);
        setSelectedImage(null);
        setIncorrectSlot(null);
      }, 1000);
    }
  }

  function handleNextTask() {
    if (currentTaskIndex >= adjNounTasks.length - 1) return;
    setCurrentTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  const choicesDisabled = selectedImage !== null || isPlaying || !hasPlayedSound;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
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
        <h1 className="text-2xl font-semibold text-foreground">
          Прилагательное и существительное
        </h1>
        <p className="text-sm text-muted-foreground">
          Прослушайте словосочетание и выберите подходящую картинку
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Уровень</Label>
            <Select value={level} onValueChange={(v) => v && setLevel(v)}>
              <SelectTrigger className="w-24">
                <SelectValue>{() => level}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
              </SelectContent>
            </Select>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select
              value={String(currentTaskIndex)}
              onValueChange={(v) => v && setCurrentTaskIndex(Number(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(task.id)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {adjNounTasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {adjNounTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <p className="text-center text-xl font-semibold text-foreground">Покажите, где…</p>

      <div className="flex justify-center">
        <Button
          type="button"
          size="lg"
          onClick={speak}
          disabled={readyToProceed}
          className={cn(
            "gap-2 rounded-full bg-emerald-600 px-8 text-white hover:bg-emerald-600/90",
            isPlaying && "animate-pulse",
          )}
        >
          Послушайте <Volume2 className="size-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {levelChoices.map((p, idx) => {
          const isCorrectChoice = selectedImage === idx && idx === correctAnswer;
          const isIncorrectChoice = incorrectSlot === idx;
          return (
            <div key={p.id} className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => handleImageClick(idx)}
                disabled={choicesDisabled}
                className={cn(
                  "flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 bg-card p-2 transition-colors",
                  isCorrectChoice && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                  isIncorrectChoice && "border-destructive",
                  !isCorrectChoice && !isIncorrectChoice && "border-border hover:border-primary/40",
                )}
              >
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="" className="h-full w-full object-contain" />
                ) : null}
              </button>
              {isCorrectChoice && (
                <div className="w-full rounded-lg border-2 border-emerald-500 bg-emerald-50 px-4 py-3 text-center text-lg font-medium text-foreground dark:bg-emerald-950/30">
                  {p.phrase}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {readyToProceed && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextTask} onFinish={handleFinish} />
      )}

      <TrainerCompletionOverlay variant={feedback} />
    </div>
  );
}
