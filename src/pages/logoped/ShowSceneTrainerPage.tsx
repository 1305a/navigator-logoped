import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { showSceneRows } from "@/data/showSceneTrainer";
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

type Difficulty = 1 | 2 | 3;
type Side = "left" | "right";
type CardModel = { side: Side; phrase: string; imageUrl?: string; audioUrl?: string };

export default function ShowSceneTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [order, setOrder] = useState<number[]>(() => shuffleArray(showSceneRows.map((r) => r.id)));
  const [index, setIndex] = useState(0);

  const currentRow = useMemo(() => showSceneRows.find((r) => r.id === order[index]) ?? null, [order, index]);

  const pair = useMemo<{ left: CardModel; right: CardModel } | null>(() => {
    if (!currentRow) return null;
    const distractor = currentRow.distractors[difficulty - 1];
    const target: CardModel = { side: "left", phrase: currentRow.phrase, imageUrl: currentRow.imageUrl, audioUrl: currentRow.audioUrl };
    const distr: CardModel = { side: "right", phrase: distractor.phrase, imageUrl: distractor.imageUrl, audioUrl: distractor.audioUrl };
    const targetFirst = Math.random() < 0.5;
    return targetFirst
      ? { left: { ...target, side: "left" }, right: { ...distr, side: "right" } }
      : { left: { ...distr, side: "left" }, right: { ...target, side: "right" } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRow, difficulty]);

  const [activePhrase, setActivePhrase] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ side: Side; ok: boolean } | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [readyToProceed, setReadyToProceed] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setActivePhrase(null);
    setFeedback(null);
    setWrongAttempts(0);
    setReadyToProceed(false);
    audioRef.current?.pause();
    audioRef.current = null;
  }, [currentRow, difficulty]);

  const total = order.length;
  const isLastTask = index >= total - 1;

  function startLevel(lev: Difficulty) {
    audioRef.current?.pause();
    setDifficulty(lev);
    setOrder(shuffleArray(showSceneRows.map((r) => r.id)));
    setIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
  }

  function handleTaskSelect(next: number) {
    setIndex(Math.max(0, Math.min(total - 1, next)));
  }

  function handleMic() {
    if (!pair || feedback || readyToProceed || isPlaying) return;

    let target: CardModel;
    if (activePhrase === null) {
      target = Math.random() < 0.5 ? pair.left : pair.right;
      setActivePhrase(target.phrase);
    } else {
      target = pair.left.phrase === activePhrase ? pair.left : pair.right;
    }

    setIsPlaying(true);
    audioRef.current?.pause();
    if (!target.audioUrl) {
      window.setTimeout(() => setIsPlaying(false), 500);
      return;
    }
    audioRef.current = playAudioOrSpeak(target.audioUrl, target.phrase, () => setIsPlaying(false));
  }

  function handleCardClick(side: Side, phrase: string) {
    if (!pair || feedback || !activePhrase || readyToProceed) return;
    const isCorrect = phrase === activePhrase;

    if (isCorrect) {
      setFeedback({ side, ok: true });
      setCorrectCount((c) => c + 1);
      window.setTimeout(() => setReadyToProceed(true), 1100);
      return;
    }

    setFeedback({ side, ok: false });
    if (wrongAttempts === 0) {
      window.setTimeout(() => {
        setFeedback(null);
        setWrongAttempts(1);
      }, 1100);
      return;
    }

    setIncorrectCount((c) => c + 1);
    setReadyToProceed(true);
  }

  function handleNextClick() {
    audioRef.current?.pause();
    setIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  if (!pair) return null;

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
        <h1 className="text-2xl font-semibold text-foreground">Покажите…</h1>
        <p className="text-sm text-muted-foreground">
          Прослушайте фразу и выберите соответствующую сцену из двух карточек
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Уровень</Label>
            <Select value={String(difficulty)} onValueChange={(v) => v && startLevel(Number(v) as Difficulty)}>
              <SelectTrigger className="w-28">
                <SelectValue>{() => `Уровень ${difficulty}`}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Уровень 1</SelectItem>
                <SelectItem value="2">Уровень 2</SelectItem>
                <SelectItem value="3">Уровень 3</SelectItem>
              </SelectContent>
            </Select>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(index)} onValueChange={(v) => v && handleTaskSelect(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(index + 1)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {order.map((id, idx) => (
                  <SelectItem key={id} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {total}</span>
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
          disabled={Boolean(feedback || isPlaying)}
          onClick={handleMic}
        >
          Послушайте 🔊
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[pair.left, pair.right].map((card) => {
          const fb = feedback?.side === card.side ? feedback.ok : null;
          const canClick = Boolean(activePhrase && !feedback && !readyToProceed);
          return (
            <button
              key={card.side}
              type="button"
              disabled={!canClick}
              onClick={() => handleCardClick(card.side, card.phrase)}
              className={cn(
                "flex min-h-44 flex-col items-center justify-center gap-3 rounded-2xl border-4 p-4",
                fb === true && "border-emerald-500 bg-emerald-50 ring-4 ring-emerald-400 dark:bg-emerald-950/30",
                fb === false && "border-destructive bg-destructive/10 ring-4 ring-destructive/60",
                fb === null && "border-border bg-card",
              )}
            >
              {card.imageUrl ? (
                <img src={card.imageUrl} alt="" className="max-h-40 max-w-full object-contain" />
              ) : (
                <span className="text-4xl">🖼️</span>
              )}
              {fb === true && <span className="text-center text-lg font-semibold text-foreground">{card.phrase}</span>}
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
            onClick={isLastTask ? handleFinish : handleNextClick}
          >
            {isLastTask ? "Завершить тренажёр" : "Дальше →"}
          </Button>
        </div>
      )}
    </div>
  );
}
