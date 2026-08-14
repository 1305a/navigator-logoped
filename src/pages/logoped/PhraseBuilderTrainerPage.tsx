import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { phraseBuilderPhrases } from "@/data/phraseBuilderTrainer";
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
import { ArrowLeft, Image as ImageIcon } from "lucide-react";

type Zone = "subject" | "verb" | "object";
const ZONES: { key: Zone; label: string }[] = [
  { key: "subject", label: "Кто?" },
  { key: "verb", label: "Что делает?" },
  { key: "object", label: "Что?" },
];

function PhraseZone({
  label,
  value,
  status,
  isSelected,
  disabled,
  onClick,
}: {
  label: string;
  value: string | null;
  status: boolean | null;
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex min-h-14 items-center justify-center rounded-lg border px-3 text-center text-base font-semibold text-foreground transition-colors",
          status === true && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
          status === false && "border-destructive bg-destructive/10",
          status === null &&
            isSelected &&
            "border-primary bg-primary/10 ring-2 ring-primary/30",
          status === null &&
            !isSelected &&
            value &&
            "border-sky-400 bg-sky-50 dark:border-sky-700 dark:bg-sky-950/20",
          status === null &&
            !isSelected &&
            !value &&
            "border-dashed border-muted-foreground/40 bg-muted/30 text-sm font-normal text-muted-foreground",
        )}
      >
        {value ? value.toLowerCase() : "Нажмите сюда"}
      </button>
    </div>
  );
}

export default function PhraseBuilderTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrase = phraseBuilderPhrases[phraseIndex];
  const words = useMemo(
    () => [phrase.subject, phrase.verb, phrase.object],
    [phrase],
  );

  const [availableWords, setAvailableWords] = useState<string[]>(() => shuffleArray(words));
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedFromZone, setSelectedFromZone] = useState<Zone | null>(null);
  const [dropped, setDropped] = useState<Record<Zone, string | null>>({
    subject: null,
    verb: null,
    object: null,
  });
  const [validation, setValidation] = useState<Record<Zone, boolean | null>>({
    subject: null,
    verb: null,
    object: null,
  });
  const [attempt, setAttempt] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const firstOutcomeRef = useRef<Record<string, "correct" | "incorrect">>({});
  const skipAutoCheckRef = useRef(false);

  useEffect(() => {
    skipAutoCheckRef.current = true;
    setAvailableWords(shuffleArray(words));
    setDropped({ subject: null, verb: null, object: null });
    setValidation({ subject: null, verb: null, object: null });
    setAttempt(0);
    setSelectedWord(null);
    setSelectedFromZone(null);
    setIsChecking(false);
    setFeedback(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phraseIndex]);

  const isPhraseComplete =
    validation.subject === true && validation.verb === true && validation.object === true;
  const isLast = phraseIndex === phraseBuilderPhrases.length - 1;

  function registerFirst(key: string, isCorrect: boolean) {
    if (firstOutcomeRef.current[key]) return;
    firstOutcomeRef.current[key] = isCorrect ? "correct" : "incorrect";
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
  }

  function handleCheck() {
    if (isChecking) return;
    if (!dropped.subject || !dropped.verb || !dropped.object) return;
    setIsChecking(true);

    const isSubjectCorrect = dropped.subject === phrase.subject;
    const isVerbCorrect = dropped.verb === phrase.verb;
    const isObjectCorrect = dropped.object === phrase.object;
    const allCorrect = isSubjectCorrect && isVerbCorrect && isObjectCorrect;

    registerFirst(`${phraseIndex}:subject`, isSubjectCorrect);
    registerFirst(`${phraseIndex}:verb`, isVerbCorrect);
    registerFirst(`${phraseIndex}:object`, isObjectCorrect);

    setValidation({ subject: isSubjectCorrect, verb: isVerbCorrect, object: isObjectCorrect });

    if (allCorrect) {
      setFeedback("correct");
      window.setTimeout(() => setFeedback(null), 900);
      window.setTimeout(() => setIsChecking(false), 1000);
      return;
    }

    if (attempt === 0) {
      setAttempt(1);
      window.setTimeout(() => {
        setAvailableWords(shuffleArray(words));
        setDropped({ subject: null, verb: null, object: null });
        setValidation({ subject: null, verb: null, object: null });
        setIsChecking(false);
      }, 1000);
      return;
    }

    window.setTimeout(() => {
      const nextDropped = { ...dropped };
      const returned: string[] = [];
      if (!isSubjectCorrect && dropped.subject) {
        returned.push(dropped.subject);
        nextDropped.subject = null;
      }
      if (!isVerbCorrect && dropped.verb) {
        returned.push(dropped.verb);
        nextDropped.verb = null;
      }
      if (!isObjectCorrect && dropped.object) {
        returned.push(dropped.object);
        nextDropped.object = null;
      }
      setDropped(nextDropped);
      setAvailableWords((prev) => [...prev, ...returned]);
      setValidation({
        subject: isSubjectCorrect ? true : null,
        verb: isVerbCorrect ? true : null,
        object: isObjectCorrect ? true : null,
      });
      setAttempt((a) => a + 1);
      setIsChecking(false);
    }, 1000);
  }

  useEffect(() => {
    if (skipAutoCheckRef.current) {
      if (!dropped.subject && !dropped.verb && !dropped.object) {
        skipAutoCheckRef.current = false;
      }
      return;
    }
    if (!dropped.subject || !dropped.verb || !dropped.object) return;
    if (isChecking || isPhraseComplete) return;
    handleCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropped, isChecking, isPhraseComplete]);

  function handleWordSelect(word: string) {
    if (isChecking) return;
    setSelectedWord(word);
    setSelectedFromZone(null);
  }

  function handleZoneClick(zone: Zone) {
    if (isChecking) return;

    if (!selectedWord) {
      const current = dropped[zone];
      if (!current) return;
      setSelectedWord(current);
      setSelectedFromZone(zone);
      return;
    }

    if (selectedFromZone) {
      if (selectedFromZone === zone) {
        setSelectedWord(null);
        setSelectedFromZone(null);
        return;
      }
      setDropped((prev) => {
        const next = { ...prev };
        const moving = prev[selectedFromZone];
        const target = prev[zone];
        next[zone] = moving;
        next[selectedFromZone] = target ?? null;
        return next;
      });
      setValidation((prev) => ({ ...prev, [zone]: null, [selectedFromZone]: null }));
      setSelectedWord(null);
      setSelectedFromZone(null);
      return;
    }

    setDropped((prev) => {
      const next = { ...prev };
      const existing = next[zone];
      if (existing) {
        setAvailableWords((w) => (w.includes(existing) ? w : [...w, existing]));
      }
      next[zone] = selectedWord;
      return next;
    });
    setAvailableWords((prev) => prev.filter((w) => w !== selectedWord));
    setValidation((prev) => ({ ...prev, [zone]: null }));
    setSelectedWord(null);
  }

  function handleNextPhrase() {
    if (isChecking || !isPhraseComplete || isLast) return;
    setPhraseIndex((i) => i + 1);
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
        <h1 className="text-2xl font-semibold text-foreground">
          Составление фразы по картинке
        </h1>
        <p className="text-sm text-muted-foreground">
          Составьте фразу из слов: кто? что делает? что?
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select
              value={String(phraseIndex)}
              onValueChange={(v) => v && setPhraseIndex(Number(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(phraseIndex + 1)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {phraseBuilderPhrases.map((_, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              из {phraseBuilderPhrases.length}
            </span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex h-56 items-center justify-center bg-muted/40 sm:h-72">
          {phrase.imageUrl ? (
            <img
              src={phrase.imageUrl}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : (
            <ImageIcon className="size-12 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <p className="text-center text-sm text-muted-foreground">Выберите слово:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {availableWords.map((word, idx) => (
                <Button
                  key={`${word}-${idx}`}
                  type="button"
                  variant={selectedWord === word ? "default" : "secondary"}
                  className="h-auto rounded-lg px-4 py-2 text-base font-medium"
                  disabled={isChecking}
                  onClick={() => handleWordSelect(word)}
                >
                  {word.toLowerCase()}
                </Button>
              ))}
            </div>
          </div>

          {isPhraseComplete ? (
            <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50 px-4 py-3 text-center text-lg font-medium text-foreground dark:bg-emerald-950/30">
              {`${phrase.subject} ${phrase.verb.toLowerCase()} ${phrase.object.toLowerCase()}`}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {ZONES.map(({ key, label }) => (
                <PhraseZone
                  key={key}
                  label={label}
                  value={dropped[key]}
                  status={validation[key]}
                  isSelected={selectedFromZone === key}
                  disabled={isChecking}
                  onClick={() => handleZoneClick(key)}
                />
              ))}
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Попытка: <span className="font-medium text-foreground">{attempt + 1}</span>
          </p>
        </div>
      </div>

      {isPhraseComplete && !isChecking && (
        <TrainerAdvanceButton isLast={isLast} onNext={handleNextPhrase} onFinish={handleFinish} />
      )}

      <TrainerCompletionOverlay variant={feedback} />
    </div>
  );
}
