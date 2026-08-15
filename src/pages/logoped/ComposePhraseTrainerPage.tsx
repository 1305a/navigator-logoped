import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  composePhraseTasks,
  phraseCountForLevel,
  type ComposePhrase,
} from "@/data/composePhraseTrainer";
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

// Token id encodes which phrase/category it was generated from, so its
// text can always be resolved from `phrases` regardless of which array
// (bank or slot) currently holds it.
type TokenId = string;
type SlotState = [TokenId | null, TokenId | null, TokenId | null];

function tokenId(phraseIdx: number, cat: number): TokenId {
  return `p${phraseIdx}-c${cat}`;
}

function tokenText(phrases: ComposePhrase[], cat: number, id: TokenId): string {
  const [, phraseIdxStr] = id.match(/^p(\d+)-c\d+$/) ?? [];
  const phraseIdx = phraseIdxStr ? Number(phraseIdxStr) : -1;
  return phrases[phraseIdx]?.words[cat].word ?? "";
}

const CAT0_LABEL = "Кто?";
const CAT1_LABEL = "Что делает?";

export default function ComposePhraseTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [levelIdx, setLevelIdx] = useState(0);
  const [taskIndex, setTaskIndex] = useState(0);
  const task = composePhraseTasks[taskIndex];
  const phrases = useMemo(
    () => task.phrases.slice(0, phraseCountForLevel(levelIdx)),
    [task, levelIdx],
  );

  const cat2Label = useMemo(() => {
    const first = phrases[0]?.words[2].question;
    return phrases.every((p) => p.words[2].question === first) ? first : "Кого?/Что?";
  }, [phrases]);

  const [banks, setBanks] = useState<[TokenId[], TokenId[], TokenId[]]>([[], [], []]);
  const [slots, setSlots] = useState<SlotState[]>([]);
  const [results, setResults] = useState<Array<"idle" | "ok" | "bad">>([]);
  const [selected, setSelected] = useState<{ cat: number; id: TokenId } | null>(null);
  const [readyToProceed, setReadyToProceed] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    const nextBanks: [TokenId[], TokenId[], TokenId[]] = [[], [], []];
    phrases.forEach((_, pi) => {
      [0, 1, 2].forEach((cat) => nextBanks[cat].push(tokenId(pi, cat)));
    });
    setBanks([shuffleArray(nextBanks[0]), shuffleArray(nextBanks[1]), shuffleArray(nextBanks[2])]);
    setSlots(phrases.map(() => [null, null, null]));
    setResults(phrases.map(() => "idle"));
    setSelected(null);
    setReadyToProceed(false);
  }, [taskIndex, levelIdx, phrases]);

  const isLast = taskIndex === composePhraseTasks.length - 1;

  function placeToken(phraseIdx: number, cat: number, id: TokenId) {
    setSlots((prev) => {
      const next = prev.map((s) => [...s] as SlotState);
      for (let pi = 0; pi < next.length; pi++) {
        if (next[pi][cat] === id) next[pi][cat] = null;
      }
      next[phraseIdx][cat] = id;
      return next;
    });
    setBanks((prev) => {
      const next = [...prev] as [TokenId[], TokenId[], TokenId[]];
      next[cat] = next[cat].filter((t) => t !== id);
      return next;
    });
    setResults((prev) => prev.map((r, i) => (i === phraseIdx ? "idle" : r)));
  }

  function clearSlot(phraseIdx: number, cat: number) {
    const id = slots[phraseIdx]?.[cat];
    if (!id) return;
    setSlots((prev) => {
      const next = prev.map((s) => [...s] as SlotState);
      next[phraseIdx][cat] = null;
      return next;
    });
    setBanks((prev) => {
      const next = [...prev] as [TokenId[], TokenId[], TokenId[]];
      next[cat] = [...next[cat], id];
      return next;
    });
    setResults((prev) => prev.map((r, i) => (i === phraseIdx ? "idle" : r)));
  }

  function onBankClick(cat: number, id: TokenId) {
    if (readyToProceed) return;
    setSelected((prev) => (prev && prev.cat === cat && prev.id === id ? null : { cat, id }));
  }

  function onSlotClick(phraseIdx: number, cat: number) {
    if (readyToProceed || results[phraseIdx] === "ok") return;
    if (slots[phraseIdx]?.[cat]) {
      clearSlot(phraseIdx, cat);
      return;
    }
    if (selected && selected.cat === cat) {
      placeToken(phraseIdx, cat, selected.id);
      setSelected(null);
    }
  }

  useEffect(() => {
    slots.forEach((slot, phraseIdx) => {
      if (results[phraseIdx] !== "idle") return;
      if (!slot.every(Boolean)) return;
      const phrase = phrases[phraseIdx];
      if (!phrase) return;
      const norm = (s: string) => s.trim().toLowerCase();
      const ok = slot.every(
        (id, cat) => norm(tokenText(phrases, cat, id!)) === norm(phrase.words[cat].word),
      );
      setResults((prev) => prev.map((r, i) => (i === phraseIdx ? (ok ? "ok" : "bad") : r)));
      if (ok) setCorrectCount((c) => c + 1);
      else setIncorrectCount((c) => c + 1);

      if (!ok) {
        window.setTimeout(() => {
          setSlots((prev) => prev.map((s, i) => (i === phraseIdx ? [null, null, null] : s)));
          setBanks((prevBanks) => {
            const next = [...prevBanks] as [TokenId[], TokenId[], TokenId[]];
            [0, 1, 2].forEach((cat) => {
              const id = slot[cat];
              if (id) next[cat] = [...next[cat], id];
            });
            return next;
          });
          setResults((prev) => prev.map((r, i) => (i === phraseIdx ? "idle" : r)));
        }, 900);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots]);

  useEffect(() => {
    if (results.length > 0 && results.every((r) => r === "ok")) {
      setReadyToProceed(true);
    }
  }, [results]);

  function handleNextTask() {
    if (!readyToProceed || isLast) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-1 gap-1.5"
          render={<Link to="/logoped/exercise-bank" />}
        >
          <ArrowLeft className="size-4" /> Банк упражнений
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Составь фразу</h1>
        <p className="text-sm text-muted-foreground">
          Составьте фразу по картинке: «Кто? — Что делает? — Что?/Кого?»
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Уровень</Label>
            <Select
              value={String(levelIdx)}
              onValueChange={(v) => v && !readyToProceed && setLevelIdx(Number(v))}
            >
              <SelectTrigger className="w-28">
                <SelectValue>{() => `Уровень ${levelIdx + 1}`}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2].map((l) => (
                  <SelectItem key={l} value={String(l)}>
                    Уровень {l + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select
              value={String(taskIndex)}
              onValueChange={(v) => v && !readyToProceed && setTaskIndex(Number(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(task.id)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {composePhraseTasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {composePhraseTasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[CAT0_LABEL, CAT1_LABEL, cat2Label].map((label, cat) => (
          <div key={cat} className="flex flex-col gap-2 rounded-xl border bg-card p-3">
            <div className="text-center text-xs font-semibold text-muted-foreground">{label}</div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {banks[cat].map((id) => (
                <Button
                  key={id}
                  type="button"
                  variant={selected?.cat === cat && selected.id === id ? "default" : "secondary"}
                  className="h-auto rounded-lg px-3 py-1.5 text-sm font-medium"
                  disabled={readyToProceed}
                  onClick={() => onBankClick(cat, id)}
                >
                  {tokenText(phrases, cat, id)}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "grid gap-4",
          phrases.length <= 2 && "sm:grid-cols-2",
          phrases.length === 3 && "sm:grid-cols-3",
          phrases.length >= 4 && "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {phrases.map((phrase, pi) => {
          const status = results[pi];
          return (
            <div
              key={phrase.id}
              className={cn(
                "flex flex-col gap-2 rounded-2xl border p-3",
                status === "ok" && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                status === "bad" && "border-destructive bg-destructive/10",
                status === "idle" && "border-border bg-card",
              )}
            >
              <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
                {phrase.imageUrl ? (
                  <img src={phrase.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="p-2 text-center text-xs text-muted-foreground">{phrase.phrase}</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[0, 1, 2].map((cat) => {
                  const id = slots[pi]?.[cat];
                  const text = id ? tokenText(phrases, cat, id) : "";
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onSlotClick(pi, cat)}
                      disabled={readyToProceed || status === "ok"}
                      className={cn(
                        "min-h-10 rounded-lg border-2 px-1 py-1 text-center text-xs font-semibold",
                        status === "ok" && "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
                        status === "bad" && "border-destructive bg-destructive/20",
                        status === "idle" && text && "border-primary bg-primary/10",
                        status === "idle" && !text && "border-dashed border-muted-foreground/40 bg-muted/30",
                      )}
                    >
                      {text}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {readyToProceed && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextTask} onFinish={handleFinish} />
      )}
    </div>
  );
}
