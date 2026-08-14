import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { wordPartExercises } from "@/data/wordPartsTrainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, Timer, XCircle } from "lucide-react";

type Column = "left" | "right";
type SlotStatus = "correct" | "incorrect";

interface PlacedPart {
  part: string;
  position: number;
  column: Column;
  status: SlotStatus;
}

const SLOT_POSITIONS = [0, 1, 2, 3, 4];

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function WordSlot({
  column,
  commonPart,
  placed,
  highlighted,
  onClick,
}: {
  column: Column;
  commonPart: string;
  placed?: PlacedPart;
  highlighted: boolean;
  onClick: () => void;
}) {
  const status = placed?.status;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        "flex h-12 w-full items-center gap-2 rounded-lg border px-3 text-lg font-medium text-foreground transition-colors",
        status === "correct" && "justify-center border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
        status === "incorrect" && "justify-center border-destructive bg-destructive/10",
        !status && "border-dashed border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/20",
        !status && highlighted && "ring-2 ring-primary/40",
      )}
    >
      {status === "correct" &&
        (column === "left" ? `${placed!.part}${commonPart}` : `${commonPart}${placed!.part}`)}
      {status === "incorrect" &&
        (column === "left" ? `${placed!.part} ${commonPart}` : `${commonPart} ${placed!.part}`)}
      {!status && column === "left" && (
        <>
          <span className="flex-1 border-b-2 border-foreground/60 pb-0.5" />
          <span>{commonPart}</span>
        </>
      )}
      {!status && column === "right" && (
        <>
          <span>{commonPart}</span>
          <span className="flex-1 border-b-2 border-foreground/60 pb-0.5" />
        </>
      )}
    </button>
  );
}

export default function WordPartsTrainerPage() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [placedParts, setPlacedParts] = useState<PlacedPart[]>([]);
  const [availableParts, setAvailableParts] = useState<string[]>(() =>
    shuffle(wordPartExercises[0].parts),
  );
  const [feedback, setFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const slotFirstOutcomeRef = useRef<Record<string, SlotStatus>>({});
  const current = wordPartExercises[currentIndex];
  const isLast = currentIndex === wordPartExercises.length - 1;

  useEffect(() => {
    const interval = window.setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const correctPlaced = useMemo(
    () => placedParts.filter((p) => p.status === "correct").length,
    [placedParts],
  );
  const isExerciseComplete = correctPlaced === 10;
  const wasCompleteRef = useRef(false);

  useEffect(() => {
    const was = wasCompleteRef.current;
    wasCompleteRef.current = isExerciseComplete;
    if (!was && isExerciseComplete) {
      setFeedback(true);
      const t = window.setTimeout(() => setFeedback(false), 900);
      return () => window.clearTimeout(t);
    }
  }, [isExerciseComplete]);

  function slotKey(exerciseId: number, column: Column, position: number) {
    return `${exerciseId}:${column}:${position}`;
  }

  function registerFirstOutcome(key: string, isCorrect: boolean) {
    if (slotFirstOutcomeRef.current[key]) return;
    slotFirstOutcomeRef.current[key] = isCorrect ? "correct" : "incorrect";
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
  }

  function handleSlotClick(position: number, column: Column) {
    if (!selectedPart) return;
    const alreadyPlaced = placedParts.find((p) => p.position === position && p.column === column);
    if (alreadyPlaced) return;

    const part = selectedPart;
    const isCorrect =
      column === "left" ? current.endsWith.includes(part) : current.startsWith.includes(part);
    registerFirstOutcome(slotKey(current.id, column, position), isCorrect);

    setPlacedParts((prev) => [...prev, { part, position, column, status: isCorrect ? "correct" : "incorrect" }]);
    setSelectedPart(null);

    if (isCorrect) {
      setAvailableParts((prev) => prev.filter((p) => p !== part));
    } else {
      window.setTimeout(() => {
        setPlacedParts((prev) =>
          prev.filter((p) => !(p.part === part && p.position === position && p.column === column)),
        );
      }, 1000);
    }
  }

  function loadExercise(index: number) {
    setCurrentIndex(index);
    setSelectedPart(null);
    setPlacedParts([]);
    setAvailableParts(shuffle(wordPartExercises[index].parts));
  }

  function handleNext() {
    if (isLast) return;
    loadExercise(currentIndex + 1);
  }

  function handleFinish() {
    toast.success(
      `Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно, время ${formatTime(elapsedSeconds)}`,
    );
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
        <h1 className="text-2xl font-semibold text-foreground">
          Добавить часть слова (начало/конец)
        </h1>
        <p className="text-sm text-muted-foreground">
          Словообразование: добавьте части слова до или после общей части
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select
              value={String(currentIndex)}
              onValueChange={(v) => v && loadExercise(Number(v))}
            >
              <SelectTrigger className="w-32">
                <SelectValue>
                  {() => `${current.id} (${current.commonPart})`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {wordPartExercises.map((ex, idx) => (
                  <SelectItem key={ex.id} value={String(idx)}>
                    {ex.id} ({ex.commonPart})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {wordPartExercises.length}</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" /> {correctCount}
            </span>
            <span className="flex items-center gap-1 font-medium text-destructive">
              <XCircle className="size-4" /> {incorrectCount}
            </span>
            <span className="flex items-center gap-1 font-mono text-muted-foreground">
              <Timer className="size-4" /> {formatTime(elapsedSeconds)}
            </span>
            <Button variant="outline" size="sm" onClick={handleFinish}>
              Завершить тренажёр
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xl font-semibold text-foreground">Добавьте части слова</p>
        <p className="text-sm text-muted-foreground">
          Выберите слог и подставьте его в начало или конец слова
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {availableParts.map((part, idx) => (
          <Button
            key={`${part}-${idx}`}
            type="button"
            variant={selectedPart === part ? "default" : "secondary"}
            className="h-auto rounded-lg px-4 py-2 text-lg font-medium"
            onClick={() => setSelectedPart(part)}
          >
            {part}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="ml-auto flex w-full max-w-44 flex-col gap-3">
          {SLOT_POSITIONS.map((position) => (
            <WordSlot
              key={position}
              column="left"
              commonPart={current.commonPart}
              placed={placedParts.find((p) => p.position === position && p.column === "left")}
              highlighted={!!selectedPart}
              onClick={() => handleSlotClick(position, "left")}
            />
          ))}
        </div>
        <div className="mr-auto flex w-full max-w-44 flex-col gap-3">
          {SLOT_POSITIONS.map((position) => (
            <WordSlot
              key={position}
              column="right"
              commonPart={current.commonPart}
              placed={placedParts.find((p) => p.position === position && p.column === "right")}
              highlighted={!!selectedPart}
              onClick={() => handleSlotClick(position, "right")}
            />
          ))}
        </div>
      </div>

      {isExerciseComplete && (
        <div className="flex justify-center">
          <Button
            size="lg"
            className="rounded-full bg-emerald-600 px-8 text-white hover:bg-emerald-600/90"
            onClick={isLast ? handleFinish : handleNext}
          >
            {isLast ? "Завершить тренажёр" : "Дальше →"}
          </Button>
        </div>
      )}

      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex size-24 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 className="size-12" />
          </div>
        </div>
      )}
    </div>
  );
}
