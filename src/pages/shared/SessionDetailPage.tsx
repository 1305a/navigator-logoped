import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import { getSessionStatus } from "@/lib/therapy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { GradeStars } from "@/components/app/GradeStars";
import { generateTimeOptions, rangesOverlap, timeToMinutes } from "@/lib/schedule";
import { ArrowLeft, Lock, Play, Plus, Trash2 } from "lucide-react";

function formatRuDate(date: Date) {
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function parseRuDate(date: string): Date {
  const [d, m, y] = date.split(".").map(Number);
  return new Date(y, m - 1, d);
}

export default function SessionDetailPage({
  patientId,
  backTo,
  allowGrading,
}: {
  patientId: string;
  backTo: string;
  allowGrading: boolean;
}) {
  const { sessionId } = useParams<{ sessionId: string }>();
  const {
    getPatient,
    setSessionExerciseDone,
    addSessionExercise,
    removeSessionExercise,
    gradeSession,
    updateSessionSchedule,
    rooms,
    exercises,
    getExercise,
    workSections,
  } = useAppState();
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [exerciseToAdd, setExerciseToAdd] = useState("");

  const patient = getPatient(patientId);
  const session = patient?.sessions.find((s) => s.id === sessionId);

  const [scheduleLocation, setScheduleLocation] = useState<"home" | "room">(
    session?.location === "room" ? "room" : "home",
  );
  const [scheduleRoomId, setScheduleRoomId] = useState(session?.roomId ?? "");
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(
    session?.scheduledDate ? parseRuDate(session.scheduledDate) : undefined,
  );
  const [scheduleStartTime, setScheduleStartTime] = useState<string | null>(
    session?.startTime ?? null,
  );
  const [scheduleEndTime, setScheduleEndTime] = useState<string | null>(session?.endTime ?? null);
  const timeOptions = generateTimeOptions();

  function goBack() {
    navigate(allowGrading ? `${backTo}?tab=program` : backTo);
  }

  if (!patient || !session) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-muted-foreground">Занятие не найдено.</p>
        <Button variant="outline" className="mt-4" onClick={goBack}>
          <ArrowLeft /> Назад
        </Button>
      </div>
    );
  }

  const status = getSessionStatus(session, patient.sessions);

  if (status === "locked") {
    return (
      <div className="mx-auto max-w-2xl">
        <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={goBack}>
          <ArrowLeft className="size-4" /> Назад к программе
        </Button>
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-12 text-center">
          <Lock className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Занятие пока недоступно</p>
          <p className="max-w-sm text-xs text-muted-foreground">
            Чтобы открыть «{session.title}», нужно сначала завершить предыдущее занятие.
          </p>
        </div>
      </div>
    );
  }

  const allDone = session.exercises.length > 0 && session.exercises.every((ex) => ex.done);
  const completed = status === "completed";
  const canEditExercises = allowGrading && !completed;
  const availableToAdd = exercises.filter(
    (e) => !session.exercises.some((se) => se.exerciseId === e.id),
  );

  function handleComplete() {
    if (!sessionId || !selectedGrade) return;
    gradeSession(patientId, sessionId, selectedGrade);
    toast.success("Занятие завершено");
    goBack();
  }

  function handleAddExercise() {
    if (!sessionId || !exerciseToAdd) return;
    addSessionExercise(patientId, sessionId, exerciseToAdd);
    toast.success("Упражнение добавлено в занятие");
    setExerciseToAdd("");
  }

  function handleRemoveExercise(exerciseId: string) {
    if (!sessionId) return;
    removeSessionExercise(patientId, sessionId, exerciseId);
    toast.success("Упражнение удалено из занятия");
  }

  function handleSaveSchedule() {
    if (!sessionId || !session) return;

    if (scheduleLocation === "home") {
      updateSessionSchedule(patientId, sessionId, { location: "home" });
      toast.success("Место проведения обновлено");
      return;
    }

    if (!scheduleRoomId || !scheduleDate || !scheduleStartTime || !scheduleEndTime) {
      toast.error("Заполните кабинет, дату и время");
      return;
    }
    if (timeToMinutes(scheduleEndTime) <= timeToMinutes(scheduleStartTime)) {
      toast.error("Время окончания должно быть позже времени начала");
      return;
    }

    const dateStr = formatRuDate(scheduleDate);
    const room = rooms.find((r) => r.id === scheduleRoomId);
    const hasConflict = room?.bookings.some(
      (b) =>
        b.id !== session.roomBookingId &&
        b.date === dateStr &&
        rangesOverlap(b.startTime, b.endTime, scheduleStartTime, scheduleEndTime),
    );
    if (hasConflict) {
      toast.error("Кабинет уже занят в это время");
      return;
    }

    updateSessionSchedule(patientId, sessionId, {
      location: "room",
      roomId: scheduleRoomId,
      date: dateStr,
      startTime: scheduleStartTime,
      endTime: scheduleEndTime,
    });
    toast.success("Место проведения обновлено");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={goBack}>
        <ArrowLeft className="size-4" /> Назад к программе
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{session.title}</CardTitle>
            <Badge variant={completed ? "secondary" : "outline"}>
              {completed ? "завершено" : "доступно"}
            </Badge>
          </div>
          <CardDescription>
            {session.exercises.length} упражнени
            {session.exercises.length === 1 ? "е" : "я"} в этом занятии
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col gap-3 rounded-lg border px-3 py-3">
            <p className="text-sm font-medium text-foreground">Место проведения</p>
            {canEditExercises ? (
              <div className="flex flex-col gap-4">
                <RadioGroup
                  value={scheduleLocation}
                  onValueChange={(v) => v && setScheduleLocation(v as "home" | "room")}
                >
                  <label className="flex items-center gap-2.5 text-sm text-foreground">
                    <RadioGroupItem value="home" /> Дома
                  </label>
                  <label className="flex items-center gap-2.5 text-sm text-foreground">
                    <RadioGroupItem value="room" /> В кабинете
                  </label>
                </RadioGroup>

                {scheduleLocation === "room" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label>Кабинет</Label>
                      <Select
                        value={scheduleRoomId}
                        onValueChange={(v) => v && setScheduleRoomId(v)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите кабинет">
                            {(v: string | null) =>
                              rooms.find((r) => r.id === v)?.name ?? "Выберите кабинет"
                            }
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

                    <div className="flex flex-col gap-1.5">
                      <Label>Дата</Label>
                      <Calendar
                        mode="single"
                        selected={scheduleDate}
                        onSelect={setScheduleDate}
                        defaultMonth={scheduleDate}
                        className="self-center rounded-lg border"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label>Время с</Label>
                        <Select
                          value={scheduleStartTime ?? ""}
                          onValueChange={(v) => {
                            if (!v) return;
                            setScheduleStartTime(v);
                            if (
                              scheduleEndTime &&
                              timeToMinutes(scheduleEndTime) <= timeToMinutes(v)
                            ) {
                              setScheduleEndTime(null);
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
                        <Select
                          value={scheduleEndTime ?? ""}
                          onValueChange={(v) => v && setScheduleEndTime(v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions
                              .filter(
                                (t) =>
                                  !scheduleStartTime ||
                                  timeToMinutes(t) > timeToMinutes(scheduleStartTime),
                              )
                              .map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <Button size="sm" onClick={handleSaveSchedule}>
                    Сохранить место и время
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {session.location === "room"
                  ? `Кабинет: ${rooms.find((r) => r.id === session.roomId)?.name ?? "—"}, ${session.scheduledDate} ${session.startTime}–${session.endTime}`
                  : session.location === "home"
                    ? "Дома"
                    : "Не указано"}
              </p>
            )}
          </div>

          <Separator className="my-2" />

          {session.exercises.length === 0 && (
            <p className="rounded-lg border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">
              Упражнения не добавлены
            </p>
          )}
          {session.exercises.map((ex) => {
            const exercise = getExercise(ex.exerciseId);
            if (!exercise) return null;
            const sectionTitles = exercise.sectionIds
              .map((id) => workSections.find((s) => s.id === id)?.title)
              .filter((t): t is string => !!t);
            return (
              <div
                key={ex.exerciseId}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{exercise.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {sectionTitles.join(", ")} · {exercise.duration}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={ex.done ? "secondary" : "outline"}>
                    {ex.done ? "выполнено" : "не выполнено"}
                  </Badge>
                  {!completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => {
                        if (sessionId) setSessionExerciseDone(patientId, sessionId, ex.exerciseId, false);
                        navigate(`${backTo}/session/${sessionId}/exercise/${ex.exerciseId}`);
                      }}
                    >
                      <Play className="size-3.5" /> Начать занятие
                    </Button>
                  )}
                  {canEditExercises && (
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleRemoveExercise(ex.exerciseId)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {canEditExercises && (
            <div className="flex flex-col gap-1.5 pt-1 sm:flex-row sm:items-end sm:gap-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <Select value={exerciseToAdd} onValueChange={(v) => v && setExerciseToAdd(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Добавить упражнение из банка">
                      {(value: string | null) =>
                        value
                          ? exercises.find((e) => e.id === value)?.title
                          : "Добавить упражнение из банка"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableToAdd.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        Все упражнения банка уже добавлены
                      </div>
                    ) : (
                      availableToAdd.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="gap-1.5"
                disabled={!exerciseToAdd}
                onClick={handleAddExercise}
              >
                <Plus className="size-3.5" /> Добавить
              </Button>
            </div>
          )}

          <Separator className="my-2" />

          {completed ? (
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Оценка занятия</p>
                {session.completedDate && (
                  <p className="text-xs text-muted-foreground">Завершено {session.completedDate}</p>
                )}
              </div>
              <GradeStars value={session.grade} />
            </div>
          ) : allowGrading ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border px-3 py-4">
              <p className="text-sm font-medium text-foreground">Оценка занятия</p>
              <GradeStars value={selectedGrade} onChange={setSelectedGrade} />
              {!allDone && (
                <p className="text-xs text-muted-foreground">
                  Выполните все упражнения, чтобы завершить занятие
                </p>
              )}
              <Button
                onClick={handleComplete}
                disabled={!allDone || !selectedGrade}
                className="w-full"
              >
                Завершить занятие
              </Button>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Занятие ещё не завершено логопедом.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
