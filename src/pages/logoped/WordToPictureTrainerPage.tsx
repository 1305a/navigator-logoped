import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { wordToPictureLevels } from "@/data/wordToPictureTrainer";
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
import { TrainerAdvanceButton } from "@/components/app/TrainerAdvanceButton";
import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";
import { shuffleArray } from "@/lib/trainer";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function WordToPictureTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [levelIndex, setLevelIndex] = useState(0);
  const level = wordToPictureLevels[levelIndex];
  const [taskIndex, setTaskIndex] = useState(0);
  const task = level.tasks[taskIndex];

  const [bank, setBank] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean[]>([]);
  const [redFlashIndex, setRedFlashIndex] = useState<number | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    setBank(shuffleArray(task.cards.map((c) => c.word)));
    setSelectedWord(null);
    setSolved(task.cards.map(() => false));
    setRedFlashIndex(null);
  }, [levelIndex, taskIndex, task]);

  useEffect(() => {
    setTaskIndex(0);
  }, [levelIndex]);

  const isLast = taskIndex === level.tasks.length - 1;
  const allSolved = solved.length > 0 && solved.every(Boolean);

  function onCardClick(idx: number) {
    if (allSolved || !selectedWord) return;
    const card = task.cards[idx];
    if (solved[idx]) return;

    if (selectedWord === card.word) {
      setCorrectCount((c) => c + 1);
      setBank((b) => b.filter((w) => w !== selectedWord));
      setSelectedWord(null);
      setSolved((prev) => prev.map((s, i) => (i === idx ? true : s)));
      return;
    }

    setIncorrectCount((c) => c + 1);
    setRedFlashIndex(idx);
    setSelectedWord(null);
    window.setTimeout(() => setRedFlashIndex(null), 550);
  }

  function handleNextTask() {
    if (!allSolved || isLast) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  const gridCols = task.cards.length === 6 ? "sm:grid-cols-3" : "sm:grid-cols-2";

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
        <h1 className="text-2xl font-semibold text-foreground">Подбери слово к картинке</h1>
        <p className="text-sm text-muted-foreground">Выберите подходящее слово для каждой картинки</p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Уровень</Label>
            <Select value={String(levelIndex)} onValueChange={(v) => v && setLevelIndex(Number(v))}>
              <SelectTrigger className="w-28">
                <SelectValue>{() => `Уровень ${level.level}`}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {wordToPictureLevels.map((l, idx) => (
                  <SelectItem key={l.level} value={String(idx)}>
                    Уровень {l.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(taskIndex)} onValueChange={(v) => v && setTaskIndex(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(taskIndex + 1)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {level.tasks.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {level.tasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-wrap justify-center gap-2 rounded-xl border bg-card p-3">
        {bank.map((w) => (
          <Button
            key={w}
            type="button"
            variant={selectedWord === w ? "default" : "secondary"}
            className="h-auto rounded-full px-4 py-2 text-base font-medium"
            disabled={allSolved}
            onClick={() => setSelectedWord((s) => (s === w ? null : w))}
          >
            {w}
          </Button>
        ))}
      </div>

      <div className={cn("grid gap-4 grid-cols-2", gridCols)}>
        {task.cards.map((card, idx) => (
          <button
            key={idx}
            type="button"
            disabled={solved[idx]}
            onClick={() => onCardClick(idx)}
            className={cn(
              "flex flex-col gap-2 rounded-2xl border-2 p-3 text-left",
              solved[idx] && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
              redFlashIndex === idx && "border-destructive bg-destructive/10",
              !solved[idx] && redFlashIndex !== idx && "border-border bg-card hover:border-primary/50",
            )}
          >
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted/30">
              {card.imageUrl ? (
                <img src={card.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="p-2 text-center text-xs text-muted-foreground">{card.word}</span>
              )}
            </div>
            <div
              className={cn(
                "min-h-11 rounded-lg border-2 px-2 py-1.5 text-center text-lg font-bold text-foreground",
                solved[idx] ? "border-emerald-400 bg-background" : "border-dashed border-muted-foreground/40 bg-muted/30",
              )}
            >
              {solved[idx] ? card.word : "—"}
            </div>
          </button>
        ))}
      </div>

      {allSolved && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextTask} onFinish={handleFinish} />
      )}
    </div>
  );
}
