import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Exercise, Program2Session, WorkSection } from "@/data/types";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function AutoExerciseRow({ dragId, exercise }: { dragId: string; exercise: Exercise | undefined }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: dragId });
  if (!exercise) return null;
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        "flex w-full cursor-grab items-center justify-between rounded-md border bg-card px-2.5 py-1.5 text-left text-sm text-foreground",
        isDragging && "opacity-50",
      )}
      {...listeners}
      {...attributes}
    >
      {exercise.title}
    </div>
  );
}

function AutoSectionRow({
  dragId,
  section,
  workSection,
  exercises,
}: {
  dragId: string;
  section: Program2Session["sections"][number];
  workSection: WorkSection | undefined;
  exercises: Exercise[];
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AutoSessionRow({
  session,
  index,
  exercises,
  workSections,
}: {
  session: Program2Session;
  index: number;
  exercises: Exercise[];
  workSections: WorkSection[];
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `auto-session:${session.id}`,
  });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-3">
      <div className="flex items-start gap-1.5">
        <Button type="button" size="icon-sm" variant="ghost" onClick={() => setCollapsed((v) => !v)}>
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
          Занятие {index + 1}
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
  exercises,
  workSections,
  onBuild,
}: {
  sessions: Program2Session[];
  built: boolean;
  exercises: Exercise[];
  workSections: WorkSection[];
  onBuild: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Рекомендуемая программа</CardTitle>
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
              : "Нажмите «Составить программу», чтобы сформировать рекомендуемую программу занятий."}
          </p>
        )}
        {sessions.map((session, index) => (
          <AutoSessionRow
            key={session.id}
            session={session}
            index={index}
            exercises={exercises}
            workSections={workSections}
          />
        ))}
      </CardContent>
    </Card>
  );
}
