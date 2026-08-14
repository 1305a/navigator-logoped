import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { wordEndingBlocks, type WordEndingFan } from "@/data/wordEndingsTrainer";
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
import { shuffleArray } from "@/lib/trainer";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

type Status = "correct" | "incorrect";
interface BankToken {
  id: string;
  ending: string;
}

function EndingFanCard({
  fan,
  chosenEnding,
  status,
  disabled,
  onClick,
}: {
  fan: WordEndingFan;
  chosenEnding: string | null;
  status: Status | null;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-4 text-left shadow-sm transition-colors",
        status === "correct" && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
        status === "incorrect" && "border-destructive bg-destructive/10",
        !status && "border-border bg-card",
      )}
    >
      <div className="grid grid-cols-[1fr_auto] items-stretch gap-3">
        <div className="flex flex-col justify-center gap-1.5">
          {fan.beginnings.map((b) => (
            <div
              key={b}
              className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-1.5 text-center text-xs font-medium tracking-wide text-foreground uppercase dark:border-sky-800 dark:bg-sky-950/20"
            >
              {b}
            </div>
          ))}
        </div>
        <div
          className={cn(
            "flex min-w-20 items-center justify-center rounded-lg border px-3 text-base font-semibold text-foreground",
            status === "correct" && "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
            status === "incorrect" && "border-destructive bg-destructive/20",
            !status && "border-dashed border-muted-foreground/40 bg-muted/30",
          )}
        >
          {chosenEnding ?? ""}
        </div>
      </div>
    </button>
  );
}

export default function WordEndingsTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [blockIndex, setBlockIndex] = useState(0);
  const block = wordEndingBlocks[blockIndex];

  const bankIdRef = useRef(0);
  function createToken(ending: string): BankToken {
    bankIdRef.current += 1;
    return { id: `bank-${bankIdRef.current}`, ending };
  }
  function tokensFromEndings(endings: string[]) {
    return shuffleArray(endings.map(createToken));
  }

  const [bank, setBank] = useState<BankToken[]>(() => tokensFromEndings(block.allEndings));
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Array<string | null>>([null, null, null]);
  const [statuses, setStatuses] = useState<Array<Status | null>>([null, null, null]);
  const [attempt, setAttempt] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const firstOutcomeRef = useRef<Record<string, Status>>({});
  const skipAutoCheckRef = useRef(false);

  useEffect(() => {
    skipAutoCheckRef.current = true;
    setSelectedTokenId(null);
    setPlaced([null, null, null]);
    setStatuses([null, null, null]);
    setAttempt(0);
    setIsChecking(false);
    setFeedback(null);
    setBank(tokensFromEndings(block.allEndings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockIndex]);

  const isBlockComplete = statuses.every((s) => s === "correct");
  const isLast = blockIndex === wordEndingBlocks.length - 1;

  function registerFirst(key: string, isCorrect: boolean) {
    if (firstOutcomeRef.current[key]) return;
    firstOutcomeRef.current[key] = isCorrect ? "correct" : "incorrect";
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
  }

  function check(placedEndings: Array<string | null>) {
    setIsChecking(true);
    const norm = (s: string) => s.trim().toLowerCase();
    const nextStatuses: Status[] = block.fans.map((fan, idx) => {
      const chosen = String(placedEndings[idx] ?? "").trim();
      const isCorrect = norm(chosen) === norm(fan.correctEnding);
      registerFirst(`${blockIndex}:${idx}`, isCorrect);
      return isCorrect ? "correct" : "incorrect";
    });
    setStatuses(nextStatuses);

    const allCorrect = nextStatuses.every((s) => s === "correct");
    if (allCorrect) {
      setFeedback("correct");
      window.setTimeout(() => setFeedback(null), 900);
      window.setTimeout(() => setIsChecking(false), 1000);
      return;
    }

    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);

    if (nextAttempt === 1) {
      window.setTimeout(() => {
        setPlaced([null, null, null]);
        setStatuses([null, null, null]);
        setSelectedTokenId(null);
        setBank(tokensFromEndings(block.allEndings));
        setIsChecking(false);
      }, 1000);
      return;
    }

    if (nextAttempt === 2) {
      window.setTimeout(() => {
        const keep: Array<string | null> = [null, null, null];
        const returned: string[] = [];
        for (let i = 0; i < 3; i++) {
          if (nextStatuses[i] === "correct") keep[i] = placedEndings[i];
          else if (placedEndings[i]) returned.push(placedEndings[i]!);
        }
        setPlaced(keep);
        setStatuses(nextStatuses.map((s) => (s === "correct" ? "correct" : null)));
        setSelectedTokenId(null);
        setBank((prev) => shuffleArray([...prev, ...returned.map((e) => createToken(e))]));
        setIsChecking(false);
      }, 1000);
      return;
    }

    window.setTimeout(() => {
      const keep: Array<string | null> = [null, null, null];
      const needed: string[] = [];
      for (let i = 0; i < 3; i++) {
        if (nextStatuses[i] === "correct") keep[i] = placedEndings[i];
        else needed.push(block.fans[i].correctEnding);
      }
      const correctSet = new Set(block.fans.map((f) => norm(f.correctEnding)));
      const wrongPool = block.incorrectEndings.filter((e) => !correctSet.has(norm(e)));
      const pool = wrongPool.length > 0 ? wrongPool : block.allEndings.filter((e) => !correctSet.has(norm(e)));
      const wrongEnding = pool[Math.floor(Math.random() * pool.length)] ?? block.incorrectEndings[0];
      setPlaced(keep);
      setStatuses(nextStatuses.map((s) => (s === "correct" ? "correct" : null)));
      setSelectedTokenId(null);
      setBank(shuffleArray([...needed, wrongEnding].map((e) => createToken(e))));
      setIsChecking(false);
    }, 1000);
  }

  useEffect(() => {
    if (skipAutoCheckRef.current) {
      if (placed.every((x) => x === null)) skipAutoCheckRef.current = false;
      return;
    }
    if (isBlockComplete) return;
    if (!placed.every((x) => !!x)) return;
    if (isChecking) return;
    check(placed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed, isChecking, isBlockComplete]);

  function pickEnding(tokenId: string) {
    if (isChecking) return;
    setSelectedTokenId((prev) => (prev === tokenId ? null : tokenId));
  }

  function onFanClick(fanIndex: number) {
    if (isChecking) return;
    if (statuses[fanIndex] === "correct") return;
    const current = placed[fanIndex];
    if (current) {
      setPlaced((prev) => prev.map((v, i) => (i === fanIndex ? null : v)));
      setBank((prev) => shuffleArray([...prev, createToken(current)]));
      setStatuses((prev) => prev.map((v, i) => (i === fanIndex ? null : v)));
      return;
    }
    if (!selectedTokenId) return;
    const token = bank.find((t) => t.id === selectedTokenId);
    if (!token) return;
    setPlaced((prev) => prev.map((v, i) => (i === fanIndex ? token.ending : v)));
    setBank((prev) => prev.filter((t) => t.id !== selectedTokenId));
    setSelectedTokenId(null);
    setStatuses((prev) => prev.map((v, i) => (i === fanIndex ? null : v)));
  }

  function handleNextBlock() {
    if (isChecking || !isBlockComplete || isLast) return;
    setBlockIndex((b) => b + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
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
        <h1 className="text-2xl font-semibold text-foreground">Найти окончание слов</h1>
        <p className="text-sm text-muted-foreground">
          Выберите слог и подставьте его в конец слова
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(blockIndex)} onValueChange={(v) => v && setBlockIndex(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(blockIndex + 1)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {wordEndingBlocks.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {wordEndingBlocks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {bank.map((token) => (
          <Button
            key={token.id}
            type="button"
            variant={selectedTokenId === token.id ? "default" : "secondary"}
            className="h-auto rounded-lg px-4 py-2 text-lg font-medium"
            disabled={isChecking}
            onClick={() => pickEnding(token.id)}
          >
            {token.ending}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {block.fans.map((fan, idx) => (
          <EndingFanCard
            key={idx}
            fan={fan}
            chosenEnding={placed[idx]}
            status={statuses[idx]}
            disabled={isChecking || statuses[idx] === "correct"}
            onClick={() => onFanClick(idx)}
          />
        ))}
      </div>

      {isBlockComplete && !isChecking && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextBlock} onFinish={handleFinish} />
      )}

      <TrainerCompletionOverlay variant={feedback} />
    </div>
  );
}
