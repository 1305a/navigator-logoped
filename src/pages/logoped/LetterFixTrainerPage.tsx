import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { letterFixTasks, VOWELS } from "@/data/letterFixTrainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, Image as ImageIcon, Timer, XCircle } from "lucide-react";

type WordStatus = "normal" | "correct" | "incorrect";

const LEVEL_WORDS: Record<string, number> = { "1": 2, "2": 3, "3": 4 };

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default function LetterFixTrainerPage() {
  const navigate = useNavigate();

  const [level, setLevel] = useState("3");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctedWords, setCorrectedWords] = useState<string[]>([]);
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<{ word: number; letter: number } | null>(
    null,
  );
  const [selectedVowel, setSelectedVowel] = useState<string | null>(null);
  const [feedback, setFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const wordsToShow = LEVEL_WORDS[level];
  const task = letterFixTasks[currentIndex];
  const visibleWords = useMemo(() => task.words.slice(0, wordsToShow), [task, wordsToShow]);

  useEffect(() => {
    setCorrectedWords(visibleWords.map((w) => w.incorrectWord));
    setWordStatuses(visibleWords.map(() => "normal"));
    setSelectedLetter(null);
    setSelectedVowel(null);
  }, [visibleWords]);

  useEffect(() => {
    const interval = window.setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const isTaskComplete =
    wordStatuses.length > 0 && wordStatuses.every((s) => s === "correct");
  const isLast = currentIndex === letterFixTasks.length - 1;

  useEffect(() => {
    if (!isTaskComplete) return;
    setFeedback(true);
    const t = window.setTimeout(() => setFeedback(false), 900);
    return () => window.clearTimeout(t);
  }, [isTaskComplete]);

  function applyAttempt(wordIndex: number, chosenVowel: string) {
    const word = visibleWords[wordIndex];
    const isCorrect = chosenVowel === word.correctLetter;

    if (isCorrect) {
      setCorrectedWords((prev) =>
        prev.map((w, i) => (i === wordIndex ? word.correctWord : w)),
      );
      setWordStatuses((prev) => prev.map((s, i) => (i === wordIndex ? "correct" : s)));
      setCorrectCount((c) => c + 1);
    } else {
      setWordStatuses((prev) => prev.map((s, i) => (i === wordIndex ? "incorrect" : s)));
      setIncorrectCount((c) => c + 1);
      window.setTimeout(() => {
        setWordStatuses((prev) =>
          prev.map((s, i) => (i === wordIndex && s === "incorrect" ? "normal" : s)),
        );
      }, 1000);
    }

    setSelectedLetter(null);
    setSelectedVowel(null);
  }

  function handleLetterClick(wordIndex: number, letterIndex: number) {
    const word = visibleWords[wordIndex];
    const isWrongLetter = letterIndex === word.wrongIndex && wordStatuses[wordIndex] !== "correct";

    if (!isWrongLetter) {
      setSelectedLetter(null);
      setSelectedVowel(null);
      return;
    }

    if (selectedVowel) {
      applyAttempt(wordIndex, selectedVowel);
      return;
    }
    setSelectedLetter({ word: wordIndex, letter: letterIndex });
  }

  function handleVowelClick(vowel: string) {
    if (selectedLetter) {
      applyAttempt(selectedLetter.word, vowel);
      return;
    }
    setSelectedVowel(vowel);
  }

  function loadTask(index: number) {
    setCurrentIndex(index);
  }

  function handleNext() {
    if (isLast) return;
    loadTask(currentIndex + 1);
  }

  function handleFinish() {
    toast.success(
      `Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно, время ${formatTime(elapsedSeconds)}`,
    );
    navigate("/logoped/exercise-bank");
  }

  const isSelectionActive = !!selectedLetter || !!selectedVowel;

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
        <h1 className="text-2xl font-semibold text-foreground">Исправь букву в слове</h1>
        <p className="text-sm text-muted-foreground">
          Выберите правильную гласную букву в слове по картинке
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
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
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Задание</Label>
              <Select value={String(currentIndex)} onValueChange={(v) => v && loadTask(Number(v))}>
                <SelectTrigger className="w-20">
                  <SelectValue>{() => String(task.id)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {letterFixTasks.map((t, idx) => (
                    <SelectItem key={t.id} value={String(idx)}>
                      {t.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">из {letterFixTasks.length}</span>
            </div>
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
        <p className="text-xl font-semibold text-foreground">Исправить ошибку</p>
        <p className="text-sm text-muted-foreground">Исправьте ошибку в слове</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div
          className={cn(
            "grid flex-1 gap-4",
            wordsToShow === 3 ? "grid-cols-3" : "grid-cols-2",
          )}
        >
          {visibleWords.map((word, wordIndex) => {
            const status = wordStatuses[wordIndex];
            return (
              <Card key={word.id}>
                <CardContent className="flex flex-col items-center gap-3 pt-6">
                  {word.imageUrl ? (
                    <img
                      src={word.imageUrl}
                      alt={word.correctWord}
                      className="size-32 rounded-lg bg-muted object-contain"
                    />
                  ) : (
                    <div className="flex size-32 items-center justify-center rounded-lg bg-muted">
                      <ImageIcon className="size-10 text-muted-foreground" />
                    </div>
                  )}

                  {status === "correct" ? (
                    <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50 px-4 py-2 text-lg font-semibold tracking-wide text-foreground dark:bg-emerald-950/30">
                      {correctedWords[wordIndex]}
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex gap-1 rounded-lg border-2 px-2 py-2",
                        status === "incorrect"
                          ? "border-destructive bg-destructive/10"
                          : "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/20",
                      )}
                    >
                      {(correctedWords[wordIndex] ?? "").split("").map((letter, letterIndex) => (
                        <button
                          key={letterIndex}
                          type="button"
                          onClick={() => handleLetterClick(wordIndex, letterIndex)}
                          className={cn(
                            "flex size-9 items-center justify-center rounded-md bg-rose-50 text-lg font-semibold text-foreground dark:bg-rose-950/30",
                            selectedLetter?.word === wordIndex &&
                              selectedLetter.letter === letterIndex &&
                              "bg-sky-100 ring-2 ring-sky-500 dark:bg-sky-900/40",
                          )}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card
          className={cn(
            "h-fit lg:w-44",
            isSelectionActive && "border-primary ring-2 ring-primary/30",
          )}
        >
          <CardHeader>
            <CardTitle className="text-sm">Гласные</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-5 gap-2 lg:grid-cols-2">
            {VOWELS.map((vowel) => (
              <Button
                key={vowel}
                type="button"
                variant={selectedVowel === vowel ? "default" : "secondary"}
                className="h-10 text-lg"
                onClick={() => handleVowelClick(vowel)}
              >
                {vowel}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {isTaskComplete && (
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
