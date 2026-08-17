import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Exercise, Program2Session, Room, WorkSection } from "@/data/types";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RefreshCw, Sparkles } from "lucide-react";
import { Program2ExerciseModal } from "@/components/app/program2/Program2ExerciseModal";
import { cn } from "@/lib/utils";

function AutoExerciseRow({
  dragId,
  exercise,
  onOpen,
}: {
  dragId: string;
  exercise: Exercise | undefined;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: dragId });
  if (!exercise) return null;
  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onOpen}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        "flex w-full cursor-grab items-center justify-between rounded-md border bg-card px-2.5 py-1.5 text-left text-sm text-foreground hover:bg-accent/40",
        isDragging && "opacity-50",
      )}
      {...listeners}
      {...attributes}
    >
      {exercise.title}
    </button>
  );
}

function AutoSectionRow({
  dragId,
  section,
  workSection,
  exercises,
  onOpenExercise,
}: {
  dragId: string;
  section: Program2Session["sections"][number];
  workSection: WorkSection | undefined;
  exercises: Exercise[];
  onOpenExercise: (exerciseInstanceId: string) => void;
}) {
  const sectionExercises = section.exercises;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: dragId });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border bg-muted/20 p-2">
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? <Plus className="size-3.5" /> : <Minus className="size-3.5" />}
        </Button>
        <div
          ref={setNodeRef}
          style={{ transform: CSS.Translate.toString(transform) }}
          className={cn(
            "flex-1 cursor-grab rounded-md px-1.5 py-0.5 text-sm font-medium text-foreground",
            isDragging && "opacity-50",
          )}
          {...listeners}
          {...attributes}
        >
          {workSection?.title ?? "Раздел"}
        </div>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-1.5 pl-7">
          {sectionExercises.length === 0 && (
            <p className="text-xs text-muted-foreground">Нет упражнений</p>
          )}
          {sectionExercises.map((ex) => (
            <AutoExerciseRow
              key={ex.id}
              dragId={`${dragId.replace("auto-section:", "auto-exercise:")}:${ex.id}`}
              exercise={exercises.find((e) => e.id === ex.exerciseId)}
              onOpen={() => onOpenExercise(ex.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AutoSessionRow({
  session,
  rooms,
  exercises,
  workSections,
  onOpenExercise,
}: {
  session: Program2Session;
  rooms: Room[];
  exercises: Exercise[];
  workSections: WorkSection[];
  onOpenExercise: (sectionId: string, exerciseInstanceId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `auto-session:${session.id}`,
  });
  const [collapsed, setCollapsed] = useState(false);

  const room = rooms.find((r) => r.id === session.roomId);

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-3">
      <div className="flex items-start gap-1.5">
        <Button type="button" size="icon-sm" variant="ghost" onClick={() => setCollapsed((v) => !v)}>
          {collapsed ? <Plus className="size-3.5" /> : <Minus className="size-3.5" />}
        </Button>
        <div
          ref={setNodeRef}
          style={{ transform: CSS.Translate.toString(transform) }}
          className={cn("flex-1 cursor-grab rounded-md px-1.5 py-0.5", isDragging && "opacity-50")}
          {...listeners}
          {...attributes}
        >
          <p className="text-sm font-medium text-foreground">{session.date ?? "Дата не указана"}</p>
          <p className="text-xs text-muted-foreground">
            {session.startTime && session.endTime ? `${session.startTime}–${session.endTime} · ` : ""}
            {session.location === "room" ? `Кабинет: ${room?.name ?? "—"}` : "Дома"}
          </p>
        </div>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-2 pl-7">
          {session.sections.length === 0 && (
            <p className="text-xs text-muted-foreground">Нет разделов</p>
          )}
          {session.sections.map((section) => (
            <AutoSectionRow
              key={section.id}
              dragId={`auto-section:${session.id}:${section.id}`}
              section={section}
              workSection={workSections.find((s) => s.id === section.sectionId)}
              exercises={exercises}
              onOpenExercise={(exerciseInstanceId) => onOpenExercise(section.id, exerciseInstanceId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Program2AutoPane({
  sessions,
  built,
  rooms,
  exercises,
  workSections,
  onBuild,
}: {
  sessions: Program2Session[];
  built: boolean;
  rooms: Room[];
  exercises: Exercise[];
  workSections: WorkSection[];
  onBuild: () => void;
}) {
  const [selected, setSelected] = useState<{
    sessionLocation: "home" | "room" | null;
    exercise: Exercise | undefined;
  } | null>(null);

  function openExercise(session: Program2Session, sectionId: string, exerciseInstanceId: string) {
    const section = session.sections.find((s) => s.id === sectionId);
    const entry = section?.exercises.find((e) => e.id === exerciseInstanceId);
    const exercise = entry ? exercises.find((e) => e.id === entry.exerciseId) : undefined;
    setSelected({ sessionLocation: session.location, exercise });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Автоматическая программа</CardTitle>
        <CardDescription>
          Формируется системой на основе банка упражнений. Доступна только для просмотра.
        </CardDescription>
        <CardAction>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onBuild}>
            {built ? <RefreshCw className="size-3.5" /> : <Sparkles className="size-3.5" />}
            {built ? "Обновить" : "Составить программу"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {sessions.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {built
              ? "Не удалось сформировать программу — недостаточно данных в банке упражнений."
              : "Нажмите «Составить программу», чтобы сформировать автоматическую программу занятий."}
          </p>
        )}
        {sessions.map((session) => (
          <AutoSessionRow
            key={session.id}
            session={session}
            rooms={rooms}
            exercises={exercises}
            workSections={workSections}
            onOpenExercise={(sectionId, exerciseInstanceId) =>
              openExercise(session, sectionId, exerciseInstanceId)
            }
          />
        ))}
      </CardContent>

      <Program2ExerciseModal
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        exercise={selected?.exercise}
        entry={undefined}
        location={selected?.sessionLocation ?? null}
        readOnly
      />
    </Card>
  );
}
