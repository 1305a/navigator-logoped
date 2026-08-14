import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  difficultyPresets,
  getPhraseImageTasksForLevel,
  type PhraseImageItem,
} from "@/data/phraseImageMatchTrainer";
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

export default function PhraseImageMatchTrainerPage() {
  const navigate = useNavigate();
  const elapsedSeconds = useElapsedSeconds();

  const [difficultyId, setDifficultyId] = useState(difficultyPresets[0].id);
  const preset = difficultyPresets.find((p) => p.id === difficultyId) ?? difficultyPresets[0];
  const tasks = useMemo(() => getPhraseImageTasksForLevel(preset.level), [preset.level]);

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const task = tasks[currentTaskIndex];

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [phraseItems, setPhraseItems] = useState<PhraseImageItem[]>([]);
  const [phrases, setPhrases] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [readyToProceed, setReadyToProceed] = useState(false);

  useEffect(() => {
    setCurrentTaskIndex(0);
    setMatches({});
    setSelectedPhrase(null);
    setSelectedImage(null);
    setReadyToProceed(false);
  }, [difficultyId]);

  useEffect(() => {
    if (!task) return;
    const selected = task.phrases.slice(0, preset.pictureCount);
    setPhraseItems(selected);
    setPhrases(shuffleArray(selected.map((p) => p.phrase)));
    setImages(selected.map((p) => p.image));
    setMatches({});
    setSelectedPhrase(null);
    setSelectedImage(null);
    setReadyToProceed(false);
  }, [currentTaskIndex, task, preset.pictureCount]);

  const isLast = currentTaskIndex === tasks.length - 1;
  const unmatchedPhrases = phrases.filter((p) => !matches[p]);

  function checkMatch(phrase: string, image: string) {
    const item = phraseItems.find((p) => p.phrase === phrase);
    const isCorrect = item?.image === image;
    setFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      const nextMatches = { ...matches, [phrase]: image };
      setMatches(nextMatches);
      setCorrectCount((c) => c + 1);
      setSelectedPhrase(null);
      setSelectedImage(null);
      if (Object.keys(nextMatches).length === phrases.length) {
        window.setTimeout(() => {
          setFeedback(null);
          setReadyToProceed(true);
        }, 900);
        return;
      }
    } else {
      setIncorrectCount((c) => c + 1);
      setSelectedPhrase(null);
      setSelectedImage(null);
    }
    window.setTimeout(() => setFeedback(null), 1000);
  }

  function onPhraseClick(phrase: string) {
    if (matches[phrase]) return;
    if (selectedImage) checkMatch(phrase, selectedImage);
    else setSelectedPhrase((prev) => (prev === phrase ? null : phrase));
  }

  function onImageClick(image: string) {
    if (Object.values(matches).includes(image)) return;
    if (selectedPhrase) checkMatch(selectedPhrase, image);
    else setSelectedImage((prev) => (prev === image ? null : image));
  }

  function handleNextTask() {
    if (currentTaskIndex >= tasks.length - 1) return;
    setCurrentTaskIndex((i) => i + 1);
  }

  function handleFinish() {
    toast.success(`Тренажёр завершён: ${correctCount} верно, ${incorrectCount} неверно`);
    navigate("/logoped/exercise-bank");
  }

  if (!task || phrases.length === 0) return null;

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
        <h1 className="text-2xl font-semibold text-foreground">Фраза и картинка</h1>
        <p className="text-sm text-muted-foreground">Подберите подпись к картинке</p>
      </div>

      <TrainerStatsBar
        controls={
          <>
            <Label className="text-sm text-muted-foreground">Сложность</Label>
            <Select value={difficultyId} onValueChange={(v) => v && setDifficultyId(v)}>
              <SelectTrigger className="w-56">
                <SelectValue>
                  {() => difficultyPresets.find((p) => p.id === difficultyId)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {difficultyPresets.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label className="text-sm text-muted-foreground">Задание</Label>
            <Select
              value={String(currentTaskIndex)}
              onValueChange={(v) => v && setCurrentTaskIndex(Number(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue>{() => String(task.id)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tasks.map((t, idx) => (
                  <SelectItem key={t.id} value={String(idx)}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">из {tasks.length}</span>
          </>
        }
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        elapsedSeconds={elapsedSeconds}
        onFinish={handleFinish}
      />

      {unmatchedPhrases.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {unmatchedPhrases.map((p) => (
            <Button
              key={p}
              type="button"
              variant={selectedPhrase === p ? "default" : "secondary"}
              className="h-auto rounded-lg px-4 py-2 text-sm font-medium"
              onClick={() => onPhraseClick(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      )}

      <div
        className={cn(
          "grid gap-3",
          preset.pictureCount === 4 && "grid-cols-2",
          preset.pictureCount === 3 && "grid-cols-3",
          preset.pictureCount === 2 && "grid-cols-2",
        )}
      >
        {images.map((img) => {
          const matchedPhrase = Object.entries(matches).find(([, v]) => v === img)?.[0] ?? null;
          const isSelected = selectedImage === img;
          return (
            <div key={img} className="flex flex-col gap-2">
              <button
                type="button"
                disabled={!!matchedPhrase}
                onClick={() => onImageClick(img)}
                className={cn(
                  "flex aspect-square items-center justify-center overflow-hidden rounded-lg border bg-card p-2 transition-colors",
                  matchedPhrase
                    ? "cursor-default border-emerald-500"
                    : "hover:border-primary/50",
                  isSelected && "ring-2 ring-primary",
                )}
              >
                <img src={img} alt="" className="max-h-full max-w-full object-contain" />
              </button>
              {matchedPhrase && (
                <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-foreground dark:bg-emerald-950/30">
                  {matchedPhrase}
                </div>
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
