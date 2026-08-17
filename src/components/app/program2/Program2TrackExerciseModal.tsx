import { useEffect, useState } from "react";
import type { Exercise, Program2Exercise, Room } from "@/data/types";
import { formatRuDate, parseRuDateToDate, type Program2ExerciseScheduleDetails } from "@/lib/program2";
import { generateTimeOptions, timeToMinutes } from "@/lib/schedule";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradeStars } from "@/components/app/GradeStars";
import { CheckCircle2, Play, Save, Timer } from "lucide-react";

const timeOptions = generateTimeOptions();

const ratingLabels: { key: keyof Program2Exercise["ratings"]; label: string }[] = [
  { key: "accuracy", label: "Точность выполнения" },
  { key: "independence", label: "Самостоятельность" },
  { key: "pace", label: "Темп выполнения" },
];

export function Program2TrackExerciseModal({
  open,
  onOpenChange,
  exercise,
  entry,
  editable,
  rooms,
  onSchedule,
  onComplete,
  onRate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: Exercise | undefined;
  entry: Program2Exercise | undefined;
  editable: boolean;
  rooms: Room[];
  onSchedule?: (details: Program2ExerciseScheduleDetails) => void;
  onComplete: (details: Program2ExerciseScheduleDetails) => void;
  onRate?: (ratings: Program2Exercise["ratings"]) => void;
}) {
  const [mode, setMode] = useState<"done" | "scheduled">("scheduled");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [roomId, setRoomId] = useState("");
  const [draftRatings, setDraftRatings] = useState<Program2Exercise["ratings"]>({
    accuracy: null,
    independence: null,
    pace: null,
  });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMode(entry?.done ? "done" : "scheduled");
    setDate(entry?.date ? parseRuDateToDate(entry.date) : undefined);
    setStartTime(entry?.startTime ?? null);
    setEndTime(entry?.endTime ?? null);
    setRoomId(entry?.roomId ?? "");
    setDraftRatings(entry?.ratings ?? { accuracy: null, independence: null, pace: null });
    setStarted(false);
  }, [open, entry]);

  if (!exercise) return null;

  function handleSaveSchedule() {
    if (!date) return;
    if (mode === "scheduled") {
      onSchedule?.({
        done: false,
        date: formatRuDate(date),
        startTime,
        endTime,
        roomId: roomId || null,
      });
    } else {
      onComplete({
        done: true,
        date: formatRuDate(date),
        startTime,
        endTime,
        roomId: null,
      });
    }
    onOpenChange(false);
  }

  function handleSaveRating() {
    if (draftRatings.accuracy === null || draftRatings.independence === null || draftRatings.pace === null) {
      return;
    }
    onRate?.(draftRatings);
    onOpenChange(false);
  }

  function handleFinishPatient() {
    onComplete({
      done: true,
      date: formatRuDate(new Date()),
      startTime: null,
      endTime: null,
      roomId: null,
    });
    setStarted(false);
    onOpenChange(false);
  }

  const scheduleValid = mode === "done" ? !!date : !!date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{exercise.title}</DialogTitle>
          <DialogDescription>{exercise.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="size-4" /> Продолжительность: {exercise.duration}
          </div>

          {editable && (
            <>
              <div className="flex flex-col gap-2">
                <Label>Статус</Label>
                <RadioGroup value={mode} onValueChange={(v) => v && setMode(v as "done" | "scheduled")}>
                  <label className="flex items-center gap-2.5 text-sm text-foreground">
                    <RadioGroupItem value="scheduled" /> Запланировано
                  </label>
                  <label className="flex items-center gap-2.5 text-sm text-foreground">
                    <RadioGroupItem value="done" /> Выполнено
                  </label>
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Дата</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  defaultMonth={date}
                  className="self-center rounded-lg border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Время с</Label>
                  <Select
                    value={startTime ?? ""}
                    onValueChange={(v) => {
                      if (!v) return;
                      setStartTime(v);
                      if (endTime && timeToMinutes(endTime) <= timeToMinutes(v)) {
                        setEndTime(null);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Время по</Label>
                  <Select value={endTime ?? ""} onValueChange={(v) => v && setEndTime(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions
                        .filter((t) => !startTime || timeToMinutes(t) > timeToMinutes(startTime))
                        .map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {mode === "scheduled" && (
                <div className="flex flex-col gap-1.5">
                  <Label>Кабинет</Label>
                  <Select value={roomId} onValueChange={(v) => v && setRoomId(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Не указан">
                        {(v: string | null) => rooms.find((r) => r.id === v)?.name ?? "Не указан"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={handleSaveSchedule} disabled={!scheduleValid} className="w-fit gap-1.5">
                <Save className="size-4" /> Сохранить
              </Button>

              {mode === "done" && (
                <div className="flex flex-col gap-3 rounded-lg border p-4">
                  <p className="text-sm font-medium text-foreground">Оценка выполнения</p>
                  {ratingLabels.map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <GradeStars
                        value={draftRatings[key]}
                        size="sm"
                        onChange={(v) => setDraftRatings((prev) => ({ ...prev, [key]: v }))}
                      />
                    </div>
                  ))}
                  <Button
                    size="sm"
                    className="w-fit gap-1.5"
                    disabled={
                      draftRatings.accuracy === null ||
                      draftRatings.independence === null ||
                      draftRatings.pace === null
                    }
                    onClick={handleSaveRating}
                  >
                    Сохранить оценку
                  </Button>
                </div>
              )}
            </>
          )}

          {!editable && (
            <>
              {!entry?.done && !started && (
                <Button onClick={() => setStarted(true)} className="w-fit gap-1.5">
                  <Play className="size-4" /> Начать задание
                </Button>
              )}

              {started && (
                <div className="flex flex-col items-center gap-3 rounded-lg border bg-accent/40 p-8 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Play className="size-6" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Задание выполняется…</p>
                  <Button size="sm" variant="outline" onClick={handleFinishPatient}>
                    Закончить
                  </Button>
                </div>
              )}

              {entry?.done && !started && (
                <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="size-4 text-primary" /> Выполнено {entry.date}
                    {entry.autoGraded && (
                      <Badge variant="secondary" className="ml-1">
                        Оценка проставлена автоматически
                      </Badge>
                    )}
                  </div>
                  {ratingLabels.map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <GradeStars value={entry.ratings[key]} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
