import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { featurePairTasks, resolveFeatureAudio } from "@/data/chooseByFeatureTrainer";
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
import { playAudioOrSpeak } from "@/lib/trainer";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

type Stage = "listen" | "pickCard" | "aEtot";
type CardUi = "idle" | "ok" | "bad" | "disabled" | "otherFocus";

const AETOT_AUDIO = resolveFeatureAudio("aetot.mp3");

export default function ChooseByFeatureTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [taskIndex, setTaskIndex] = useState(0);
  const task = featurePairTasks[taskIndex];

  const [targetIdx, setTargetIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("listen");
  const [isPlaying, setIsPlaying] = useState(false);
  const [cardUi, setCardUi] = useState<[CardUi, CardUi]>(["idle", "idle"]);
  const [cardLabels, setCardLabels] = useState<[string | null, string | null]>([null, null]);
  const [attrFlash, setAttrFlash] = useState<{ idx: number; kind: "ok" | "bad" } | null>(null);
  const [taskComplete, setTaskComplete] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTargetIdx(Math.random() < 0.5 ? 0 : 1);
    setStage("listen");
    setIsPlaying(false);
    setCardUi(["idle", "idle"]);
    setCardLabels([null, null]);
    setAttrFlash(null);
    setTaskComplete(false);
    audioRef.current?.pause();
    audioRef.current = null;
  }, [taskIndex]);

  const isLast = taskIndex === featurePairTasks.length - 1;
  const questionCharacteristic = task.cards[targetIdx].trueCharacteristic;
  const otherIdx = targetIdx === 0 ? 1 : 0;

  function handleListen() {
    if (isPlaying || taskComplete) return;
    setIsPlaying(true);
    audioRef.current?.pause();
    if (stage === "aEtot") {
      if (!AETOT_AUDIO) {
        window.setTimeout(() => setIsPlaying(false), 500);
        return;
      }
      audioRef.current = playAudioOrSpeak(AETOT_AUDIO, "А этот?", () => setIsPlaying(false));
      return;
    }
    const targetCard = task.cards[targetIdx];
    if (!targetCard.audioUrl) {
      setIsPlaying(false);
      setStage("pickCard");
      return;
    }
    audioRef.current = playAudioOrSpeak(targetCard.audioUrl, targetCard.trueCharacteristic, () =>
      setIsPlaying(false),
    );
    setStage("pickCard");
  }

  function onCardClick(idx: 0 | 1) {
    if (stage !== "pickCard" || cardUi[idx] === "disabled") return;
    const card = task.cards[idx];
    const isCorrect = card.trueCharacteristic === questionCharacteristic;

    if (!isCorrect) {
      setIncorrectCount((c) => c + 1);
      setCardUi((prev) => {
        const next = [...prev] as [CardUi, CardUi];
        next[idx] = "bad";
        return next;
      });
      window.setTimeout(() => {
        setCardUi((prev) => {
          const next = [...prev] as [CardUi, CardUi];
          if (next[idx] === "bad") next[idx] = "idle";
          return next;
        });
      }, 600);
      return;
    }

    setCorrectCount((c) => c + 1);
    setCardLabels((prev) => {
      const next = [...prev] as [string | null, string | null];
      next[idx] = questionCharacteristic;
      return next;
    });
    setCardUi((prev) => {
      const next = [...prev] as [CardUi, CardUi];
      next[idx] = "ok";
      next[idx === 0 ? 1 : 0] = "idle";
      return next;
    });
    window.setTimeout(() => {
      setCardUi((prev) => {
        const next = [...prev] as [CardUi, CardUi];
        next[idx] = "disabled";
        next[idx === 0 ? 1 : 0] = "otherFocus";
        return next;
      });
      setStage("aEtot");
    }, 650);
  }

  function onAttrPick(idx: number, text: string) {
    if (stage !== "aEtot") return;
    const other = task.cards[otherIdx];
    const isCorrect = text === other.trueCharacteristic;

    if (!isCorrect) {
      setIncorrectCount((c) => c + 1);
      setAttrFlash({ idx, kind: "bad" });
      window.setTimeout(() => setAttrFlash(null), 550);
      return;
    }

    setCorrectCount((c) => c + 1);
    setCardLabels((prev) => {
      const next = [...prev] as [string | null, string | null];
      next[otherIdx] = other.trueCharacteristic;
      return next;
    });
    setAttrFlash({ idx, kind: "ok" });
    window.setTimeout(() => {
      setAttrFlash(null);
      setTaskComplete(true);
    }, 650);
  }

  function handleNextTask() {
    if (!taskComplete || isLast) return;
    setTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  const other = task.cards[otherIdx];

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
        <h1 className="text-2xl font-semibold text-foreground">Выбери предмет по признаку</h1>
        <p className="text-sm text-muted-foreground">
          Прослушайте вопрос и выберите предмет по его характеристике, затем ответьте «А этот?»
        </p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select value={String(taskIndex)} onValueChange={(v) => v && !isPlaying && setTaskIndex(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(task.pairId)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {featurePairTasks.map((t, idx) => (
                  <SelectItem key={t.pairId} value={String(idx)}>
                    {t.pairId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {featurePairTasks.length}</span>
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
          disabled={isPlaying || taskComplete}
          onClick={handleListen}
        >
          Послушайте 🔊
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {task.cards.map((card, idx) => {
          const ui = cardUi[idx];
          const label = cardLabels[idx];
          return (
            <button
              key={card.id}
              type="button"
              disabled={stage !== "pickCard" || ui === "disabled"}
              onClick={() => onCardClick(idx as 0 | 1)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border-2 p-3 shadow-sm",
                ui === "ok" && "border-emerald-500 ring-4 ring-emerald-400",
                ui === "bad" && "border-destructive ring-4 ring-destructive/60",
                ui === "otherFocus" && "border-primary ring-4 ring-primary/40",
                ui === "disabled" && "opacity-60",
                ui === "idle" && "border-border",
              )}
            >
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="p-2 text-center text-xs text-muted-foreground">{card.name}</span>
                )}
              </div>
              {label && <span className="text-sm font-semibold text-foreground">{label}</span>}
            </button>
          );
        })}
      </div>

      {stage === "aEtot" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">А этот?</div>
          <div className="flex flex-wrap justify-center gap-2">
            {other.characteristics.map((text, idx) => (
              <Button
                key={idx}
                type="button"
                variant={attrFlash?.idx === idx ? "default" : "secondary"}
                disabled={taskComplete}
                className={cn(
                  "h-auto rounded-full px-4 py-2 text-sm font-medium",
                  attrFlash?.idx === idx && attrFlash.kind === "ok" && "bg-emerald-500 hover:bg-emerald-600",
                  attrFlash?.idx === idx && attrFlash.kind === "bad" && "bg-destructive hover:bg-destructive/90",
                )}
                onClick={() => onAttrPick(idx, text)}
              >
                {text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {taskComplete && (
        <div className="flex justify-center">
          <Button type="button" size="lg" className="rounded-full" onClick={isLast ? handleFinish : handleNextTask}>
            {isLast ? "Завершить тренажёр" : "Дальше →"}
          </Button>
        </div>
      )}
    </div>
  );
}
