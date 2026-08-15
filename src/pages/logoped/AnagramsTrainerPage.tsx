import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { anagramTasks, type AnagramWordPair } from "@/data/anagramsTrainer";
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
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

type Outcome = "correct" | "incorrect";

function getCorrectAnswers(w: AnagramWordPair): string[] {
  return Array.isArray(w.correct) ? w.correct : [w.correct];
}

function getAnswerRowCount(w: AnagramWordPair): number {
  return w.multiAnagram ? getCorrectAnswers(w).length : 1;
}

function emptyCellRows(w: AnagramWordPair): Array<Array<string | null>> {
  const len = w.original.length;
  return Array.from({ length: getAnswerRowCount(w) }, () => new Array<string | null>(len).fill(null));
}

const norm = (s: string) => String(s ?? "").trim().toLowerCase();

function verifyMultiAnagramAnswers(corrects: string[], rows: string[][]): boolean {
  const users = rows.map((r) => norm(r.join("")));
  if (users.some((u) => !u)) return false;
  if (new Set(users).size !== users.length) return false;
  const normCorrects = corrects.map(norm);
  if (users.length !== normCorrects.length) return false;
  const remaining = [...normCorrects];
  for (const u of users) {
    const idx = remaining.indexOf(u);
    if (idx === -1) return false;
    remaining.splice(idx, 1);
  }
  return remaining.length === 0;
}

function getCorrectRowMask(w: AnagramWordPair, rows: string[][]): boolean[] {
  const corrects = getCorrectAnswers(w).map(norm);
  const users = rows.map((r) => norm(r.join("")));
  const mask = rows.map(() => false);
  const usedCorrect = new Set<number>();
  for (let ri = 0; ri < rows.length; ri++) {
    const u = users[ri];
    if (!u) continue;
    const ci = corrects.findIndex((c, idx) => c === u && !usedCorrect.has(idx));
    if (ci !== -1) {
      usedCorrect.add(ci);
      mask[ri] = true;
    }
  }
  return mask;
}

const taskNumbers = Object.keys(anagramTasks)
  .map(Number)
  .sort((a, b) => a - b);

export default function AnagramsTrainerPage() {
  const navigate = useNavigate();

  const [taskNo, setTaskNo] = useState<number>(taskNumbers[0]);
  const words = anagramTasks[taskNo] ?? [];

  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(0);
  const selectedWord = selectedWordIndex !== null ? words[selectedWordIndex] : null;
  const [selectedLetterIndex, setSelectedLetterIndex] = useState<number | null>(null);
  const [cellRows, setCellRows] = useState<Array<Array<string | null>>>([]);
  const [lockedRows, setLockedRows] = useState<Set<number>>(() => new Set());
  const [incorrectFlashRows, setIncorrectFlashRows] = useState<Set<number>>(() => new Set());
  const [completedWords, setCompletedWords] = useState<Set<number>>(() => new Set());

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [readyForNextWord, setReadyForNextWord] = useState(false);
  const [nextWordIndex, setNextWordIndex] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const firstOutcome = useMemo(() => new Map<string, Outcome>(), [taskNo]);

  useEffect(() => {
    const t = window.setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [taskNo]);

  useEffect(() => {
    setSelectedWordIndex(0);
    setSelectedLetterIndex(null);
    setCompletedWords(new Set());
    setLockedRows(new Set());
    setIncorrectFlashRows(new Set());
    setCorrectCount(0);
    setIncorrectCount(0);
    setElapsedSeconds(0);
    setReadyToProceed(false);
    setReadyForNextWord(false);
    setNextWordIndex(null);
    setIsVerifying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskNo]);

  useEffect(() => {
    if (!selectedWord) return;
    setLockedRows(new Set());
    setIncorrectFlashRows(new Set());
    setCellRows(emptyCellRows(selectedWord));
    setSelectedLetterIndex(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWordIndex, taskNo]);

  const isLastTask = taskNo >= taskNumbers[taskNumbers.length - 1];

  function registerFirst(key: string, isCorrect: boolean) {
    if (firstOutcome.has(key)) return;
    firstOutcome.set(key, isCorrect ? "correct" : "incorrect");
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
  }

  const canVerify = useMemo(() => {
    if (incorrectFlashRows.size > 0) return false;
    if (!selectedWord || cellRows.length === 0) return false;
    if (cellRows.length !== getAnswerRowCount(selectedWord)) return false;
    return cellRows.every((row) => row.length > 0 && row.every((c) => c !== null));
  }, [cellRows, selectedWord, incorrectFlashRows]);

  useEffect(() => {
    if (isVerifying || readyForNextWord || readyToProceed) return;
    if (!selectedWord || selectedWordIndex === null || !canVerify) return;

    const rows = cellRows.map((row) => row.map((c) => c ?? ""));
    const wordIdx = selectedWordIndex;
    const w = selectedWord;
    const corrects = getCorrectAnswers(w);

    let ok: boolean;
    if (w.multiAnagram) {
      ok = verifyMultiAnagramAnswers(corrects, rows);
    } else {
      const user1 = rows[0]?.join("").trim() ?? "";
      ok = corrects.some((c) => norm(user1) === norm(c));
    }

    registerFirst(`${taskNo}:${wordIdx}`, ok);
    setIsVerifying(true);

    if (ok) {
      window.setTimeout(() => {
        const nextCompleted = new Set(completedWords);
        nextCompleted.add(wordIdx);
        setCompletedWords(nextCompleted);

        const allDone = words.every((_, idx) => nextCompleted.has(idx));
        if (allDone) {
          setSelectedWordIndex(null);
          setReadyToProceed(true);
          setIsVerifying(false);
          return;
        }
        const nextIdx = words.findIndex((_, idx) => idx !== wordIdx && !nextCompleted.has(idx));
        setIsVerifying(false);
        setReadyForNextWord(nextIdx !== -1);
        setNextWordIndex(nextIdx === -1 ? null : nextIdx);
      }, 1000);
      return;
    }

    const correctMask = getCorrectRowMask(w, rows);
    const incorrectIndices = rows
      .map((row, i) => (row.some((c) => c.length > 0) && !correctMask[i] ? i : -1))
      .filter((i) => i >= 0);

    setLockedRows((prev) => {
      const next = new Set(prev);
      correctMask.forEach((isRowCorrect, i) => {
        if (isRowCorrect) next.add(i);
      });
      return next;
    });
    setIncorrectFlashRows(new Set(incorrectIndices));
    setSelectedLetterIndex(null);
    setIsVerifying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canVerify, cellRows, isVerifying, readyForNextWord, readyToProceed, selectedWord, selectedWordIndex]);

  function clearIncorrectRow(rowIndex: number) {
    if (!selectedWord || !incorrectFlashRows.has(rowIndex)) return;
    const empty = new Array<string | null>(selectedWord.original.length).fill(null);
    setIncorrectFlashRows((prev) => {
      const next = new Set(prev);
      next.delete(rowIndex);
      return next;
    });
    setCellRows((prev) => prev.map((row, i) => (i === rowIndex ? [...empty] : row)));
    setSelectedLetterIndex(null);
  }

  function onCellClick(rowIndex: number, cellIndex: number) {
    if (!selectedWord || isVerifying || readyToProceed || readyForNextWord) return;
    if (lockedRows.has(rowIndex) || incorrectFlashRows.has(rowIndex)) return;

    if (selectedLetterIndex !== null) {
      const letter = selectedWord.original[selectedLetterIndex] ?? null;
      setCellRows((prev) => {
        const next = prev.map((r) => [...r]);
        if (next[rowIndex]) next[rowIndex][cellIndex] = letter;
        return next;
      });
      setSelectedLetterIndex(null);
      return;
    }

    setCellRows((prev) => {
      const row = prev[rowIndex];
      if (!row || row[cellIndex] === null) return prev;
      const next = prev.map((r) => [...r]);
      next[rowIndex][cellIndex] = null;
      return next;
    });
  }

  function handleNextWord() {
    if (!readyForNextWord || nextWordIndex === null) return;
    setReadyForNextWord(false);
    setNextWordIndex(null);
    setSelectedWordIndex(nextWordIndex);
  }

  function handleNextTask() {
    if (!readyToProceed || isLastTask) return;
    const idx = taskNumbers.findIndex((n) => n === taskNo);
    setTaskNo(taskNumbers[idx + 1]);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  const showCompletedAssembly =
    selectedWordIndex !== null && selectedWord !== null && completedWords.has(selectedWordIndex);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-1 gap-1.5"
          render={<Link to="/logoped/exercise-bank" />}
        >
          <ArrowLeft className="size-4" /> Банк упражнений
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">КОД 09 — Анаграммы</h1>
        <p className="text-sm text-muted-foreground">
          Переставьте буквы в слове, чтобы получилось другое слово (иногда — два)
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select
              value={String(taskNo)}
              onValueChange={(v) => v && !isVerifying && !readyToProceed && !readyForNextWord && setTaskNo(Number(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(taskNo)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {taskNumbers.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {taskNumbers.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-2 rounded-xl border bg-card p-3">
          <div className="text-sm font-semibold text-foreground">Слова</div>
          {words.map((w, idx) => {
            const done = completedWords.has(idx);
            const active = selectedWordIndex === idx;
            return (
              <button
                key={`${taskNo}-${idx}`}
                type="button"
                onClick={() => (!done && !readyToProceed && !readyForNextWord ? setSelectedWordIndex(idx) : undefined)}
                disabled={done || isVerifying || readyToProceed || readyForNextWord}
                className={cn(
                  "rounded-lg border-2 px-3 py-2 text-center text-base font-semibold",
                  done && "border-emerald-500 bg-emerald-500 text-white",
                  !done && active && "border-primary bg-primary/10 text-foreground",
                  !done && !active && "border-border bg-muted/30 text-foreground",
                )}
              >
                {w.original}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border bg-card p-4">
          {selectedWord ? (
            <>
              <div className="mb-4 flex flex-wrap justify-center gap-2">
                {selectedWord.original.split("").map((ch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedLetterIndex(idx)}
                    disabled={showCompletedAssembly || isVerifying || readyToProceed || readyForNextWord}
                    className={cn(
                      "flex size-12 items-center justify-center rounded-lg text-xl font-black",
                      selectedLetterIndex === idx ? "bg-primary/20" : "bg-muted",
                    )}
                  >
                    {ch}
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-center gap-3">
                {cellRows.map((row, rowIdx) => {
                  const rowLocked = showCompletedAssembly || lockedRows.has(rowIdx);
                  if (rowLocked) {
                    return (
                      <div
                        key={rowIdx}
                        className="rounded-lg border border-emerald-500 bg-emerald-100 px-6 py-3 text-center text-xl font-black text-foreground dark:bg-emerald-900/40"
                      >
                        {row.join("")}
                      </div>
                    );
                  }
                  if (incorrectFlashRows.has(rowIdx)) {
                    return (
                      <button
                        key={rowIdx}
                        type="button"
                        onClick={() => clearIncorrectRow(rowIdx)}
                        className="rounded-lg border border-destructive bg-destructive/20 px-6 py-3 text-center text-xl font-black text-foreground"
                      >
                        {row.join("")}
                      </button>
                    );
                  }
                  return (
                    <div key={rowIdx} className="flex flex-wrap justify-center gap-2">
                      {row.map((ch, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onCellClick(rowIdx, idx)}
                          disabled={isVerifying || readyToProceed || readyForNextWord}
                          className={cn(
                            "flex size-12 items-center justify-center rounded-lg border-2 text-xl font-black text-foreground",
                            ch ? "border-primary bg-primary/10" : "border-dashed border-muted-foreground/40 bg-muted/30",
                          )}
                        >
                          {ch ?? ""}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>

              {readyForNextWord && (
                <div className="mt-4 flex justify-center">
                  <Button type="button" size="lg" className="rounded-full" onClick={handleNextWord}>
                    Далее
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">Выберите слово слева</div>
          )}
        </div>
      </div>

      {readyToProceed && (
        <TrainerAdvanceButton isLast={isLastTask} onNext={handleNextTask} onFinish={handleFinish} />
      )}
    </div>
  );
}
