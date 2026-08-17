import { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import type { Program2Exercise } from "@/data/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Program2TrackExerciseModal } from "@/components/app/program2/Program2TrackExerciseModal";

function exerciseStatus(entry: Program2Exercise): {
  label: string;
  variant: "outline" | "secondary" | "default";
  score: string;
} {
  if (entry.done) {
    const { accuracy, independence, pace } = entry.ratings;
    if (accuracy === null || independence === null || pace === null) {
      return { label: "Ожидает оценки", variant: "secondary", score: "—" };
    }
    const score = Math.round(((accuracy + independence + pace) / 3) * 20);
    return { label: "Оценено", variant: "default", score: String(score) };
  }
  if (entry.date) {
    return { label: "Запланировано", variant: "secondary", score: "—" };
  }
  return { label: "Не назначено", variant: "outline", score: "—" };
}

export function Program2TrackTab({
  patientId,
  editable,
  title,
}: {
  patientId: string;
  editable: boolean;
  title: string;
}) {
  const { getPatient, rooms, exercises, workSections, updateProgram2ExerciseSchedule, setProgram2ExerciseRating } =
    useAppState();
  const patient = getPatient(patientId);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selected, setSelected] = useState<{
    sessionId: string;
    sectionId: string;
    entry: Program2Exercise;
  } | null>(null);

  if (!patient) return null;

  const sessions = patient.program2Work;
  const currentSessionId = activeSessionId ?? sessions[0]?.id ?? null;
  const activeSession = sessions.find((s) => s.id === currentSessionId);

  const selectedExercise = selected
    ? exercises.find((e) => e.id === selected.entry.exerciseId)
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Формируется на основе рабочей программы («Программа2»).
        </p>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          В рабочей программе пока нет занятий — трек появится после заполнения раздела
          «Программа2».
        </p>
      ) : (
        <Tabs
          value={currentSessionId ?? undefined}
          onValueChange={(v) => v && setActiveSessionId(v)}
        >
          <div className="overflow-x-auto">
            <TabsList className="w-max">
              {sessions.map((session, index) => (
                <TabsTrigger key={session.id} value={session.id} className="shrink-0 px-3">
                  Задание {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      )}

      {activeSession && (
        <Card>
          <CardContent className="flex flex-col gap-4">
            {activeSession.sections.length === 0 && (
              <p className="text-sm text-muted-foreground">В этом занятии пока нет разделов.</p>
            )}
            {activeSession.sections.map((section) => {
              const sectionTitle =
                workSections.find((s) => s.id === section.sectionId)?.title ?? "Раздел";
              return (
                <div key={section.id} className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">{sectionTitle}</p>
                  <div className="flex flex-col divide-y rounded-lg border">
                    {section.exercises.length === 0 && (
                      <p className="p-3 text-xs text-muted-foreground">Нет упражнений</p>
                    )}
                    {section.exercises.map((entry) => {
                      const exercise = exercises.find((e) => e.id === entry.exerciseId);
                      if (!exercise) return null;
                      const status = exerciseStatus(entry);
                      const dateLabel = entry.done
                        ? `Выполнено ${entry.date ?? ""}`
                        : entry.date
                          ? `${entry.date}${entry.startTime ? ` · ${entry.startTime}` : ""}`
                          : "Дата не назначена";
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() =>
                            setSelected({ sessionId: activeSession.id, sectionId: section.id, entry })
                          }
                          className="flex items-center justify-between gap-3 px-3 py-3 text-left text-sm hover:bg-accent/30"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{exercise.title}</p>
                            <p className="text-xs text-muted-foreground">{dateLabel}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <Badge variant={status.variant}>{status.label}</Badge>
                            <span className="w-7 text-right text-sm font-semibold text-foreground">
                              {status.score}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Program2TrackExerciseModal
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        exercise={selectedExercise}
        entry={selected?.entry}
        editable={editable}
        rooms={rooms}
        onSchedule={(details) => {
          if (!selected) return;
          updateProgram2ExerciseSchedule(
            patientId,
            selected.sessionId,
            selected.sectionId,
            selected.entry.id,
            details,
          );
        }}
        onComplete={(details) => {
          if (!selected) return;
          updateProgram2ExerciseSchedule(
            patientId,
            selected.sessionId,
            selected.sectionId,
            selected.entry.id,
            details,
          );
        }}
        onRate={(ratings) => {
          if (!selected) return;
          setProgram2ExerciseRating(
            patientId,
            selected.sessionId,
            selected.sectionId,
            selected.entry.id,
            ratings,
            false,
          );
        }}
      />
    </div>
  );
}
