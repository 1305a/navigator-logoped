import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { syllableInsertTasks } from "@/data/syllableInsertTrainer";
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
import { ArrowLeft } from "lucide-react";

export default function SyllableInsertTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = syllableInsertTasks[taskIndex];

  const [selectedSyllable, setSelectedSyllable] = useState<string | null>(null);
  const [selectedBlankIndex, setSelectedBlankIndex] = useState<number | null>(null);
  const [filledBlanks, setFilledBlanks] = useState<Array<string | null>>(
    Array(task.words.length).fill(null),
  );
  const [correctWords, setCorrectWords] = useState<boolean[]>(Array(task.words.length).fill(false));
  const [errorFlash, setErrorFlash] = useState<{ blank: number } | null>(null);
  const [taskHadError, setTaskHadError] = useState(false);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    setFilledBlanks(Array(task.words.length).fill(null));
    setCorrectWords(Array(task.words.length).fill(false));
    setSelectedSyllable(null);
    setSelectedBlankIndex(null);
    setErrorFlash(null);
    setTaskHadError(false);
    setReadyToProceed(false);
    setFeedback(null);
  }, [task]);

  const isLast = taskIndex === syllableInsertTasks.length - 1;
  const usedSyllables = new Set(filledBlanks.filter((s): s is string => !!s));
  const availableSyllables = task.syllables.filter((s) => !usedSyllables.has(s));

  function checkMatch(syllable: string, blankIndex: number) {
    const isCorrect = task.words[blankIndex].correctSyllable === syllable;
    if (isCorrect) {
      const newFilled = [...filledBlanks];
      newFilled[blankIndex] = syllable;
      setFilledBlanks(newFilled);
      setCorrectWords((prev) => prev.map((v, i) => (i === blankIndex ? true : v)));
      setSelectedSyllable(null);
      setSelectedBlankIndex(null);
      if (newFilled.every((b) => b !== null)) {
        if (taskHadError) setIncorrectCount((c) => c + 1);
        else setCorrectCount((c) => c + 1);
        setFeedback("correct");
        window.setTimeout(() => setFeedback(null), 900);
        setReadyToProceed(true);
      }
    } else {
      setTaskHadError(true);
      setErrorFlash({ blank: blankIndex });
      window.setTimeout(() => {
        setErrorFlash(null);
        setSelectedSyllable(null);
        setSelectedBlankIndex(null);
      }, 1000);
    }
  }

  function handleSyllableClick(syllable: string) {
    if (readyToProceed) return;
    if (selectedBlankIndex !== null) checkMatch(syllable, selectedBlankIndex);
    else setSelectedSyllable(syllable);
  }

  function handleBlankClick(index: number) {
    if (readyToProceed || filledBlanks[index]) return;
    if (selectedSyllable) checkMatch(selectedSyllable, index);
    else setSelectedBlankIndex(index);
  }

  function handleNextTask() {
    if (taskIndex >= syllableInsertTasks.length - 1) return;
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
        <h1 className="text-2xl font-semibold text-foreground">Вставь слог в слово</h1>
        <p className="text-sm text-muted-foreground">
          Выберите слог и подставьте его в пропуск в слове
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(taskIndex)} onValueChange={(v) => v && setTaskIndex(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(task.id)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {syllableInsertTasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {syllableInsertTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {availableSyllables.map((syl) => (
          <Button
            key={syl}
            type="button"
            variant={selectedSyllable === syl ? "default" : "secondary"}
            className="h-auto rounded-lg px-5 py-2.5 text-xl font-semibold"
            disabled={readyToProceed}
            onClick={() => handleSyllableClick(syl)}
          >
            {syl}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {task.words.map((word, idx) => {
          const isCorrect = correctWords[idx];
          const hasError = errorFlash?.blank === idx;
          const showSelected = filledBlanks[idx] === null && !hasError && selectedBlankIndex === idx;
          const [prefix] = word.text.split("__");
          return (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-xl font-semibold text-foreground",
                isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                hasError && "border-destructive bg-destructive/10",
                !isCorrect && !hasError && !showSelected && "border-border",
                !isCorrect && !hasError && showSelected && "border-primary bg-primary/10",
              )}
            >
              {isCorrect ? (
                <span>
                  {prefix}
                  {filledBlanks[idx]}
                </span>
              ) : (
                <>
                  <span>{prefix}</span>
                  <button
                    type="button"
                    disabled={readyToProceed}
                    onClick={() => handleBlankClick(idx)}
                    className="min-w-20 rounded-lg border-2 border-dashed border-muted-foreground/40 bg-muted/30 px-3 py-1.5"
                  >
                    __
                  </button>
                </>
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
