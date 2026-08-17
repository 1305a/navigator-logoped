import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Exercise, Program2Exercise, Program2Section, Program2Session, Room, WorkSection } from "@/data/types";
import type { SessionScheduleDetails } from "@/context/AppStateContext";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Program2SessionModal } from "@/components/app/program2/Program2SessionModal";
import { Program2ExerciseModal } from "@/components/app/program2/Program2ExerciseModal";
import { Program2ItemPicker } from "@/components/app/program2/Program2ItemPicker";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Eraser,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

interface WorkPaneCallbacks {
  fillFromAuto: () => void;
  clearWork: () => void;
  addSession: (details: SessionScheduleDetails) => void;
  updateSession: (sessionId: string, details: SessionScheduleDetails) => void;
  removeSession: (sessionId: string) => void;
  addSection: (sessionId: string, workSectionId: string) => void;
  removeSection: (sessionId: string, sectionInstanceId: string) => void;
  reorderSections: (sessionId: string, orderedIds: string[]) => void;
  addExercise: (sessionId: string, sectionInstanceId: string, exerciseId: string) => void;
  removeExercise: (sessionId: string, sectionInstanceId: string, exerciseInstanceId: string) => void;
  reorderExercises: (sessionId: string, sectionInstanceId: string, orderedIds: string[]) => void;
  rateExercise: (
    sessionId: string,
    sectionInstanceId: string,
    exerciseInstanceId: string,
    ratings: Program2Exercise["ratings"],
    autoGraded: boolean,
  ) => void;
}

function WorkExerciseRow({
  session,
  section,
  entry,
  exercise,
  index,
  total,
  onOpen,
  onMove,
  onRemove,
}: {
  session: Program2Session;
  section: Program2Section;
  entry: Program2Exercise;
  exercise: Exercise | undefined;
  index: number;
  total: number;
  onOpen: () => void;
  onMove: (direction: "up" | "down") => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
    data: { type: "work-exercise", sessionId: session.id, sectionId: section.id, exerciseId: entry.id },
  });

  if (!exercise) return null;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("flex items-center gap-1.5", isDragging && "opacity-50")}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-1 cursor-grab items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 text-left text-sm text-foreground hover:bg-accent/40"
        {...listeners}
        {...attributes}
      >
        {exercise.title}
        {entry.done && (
          <Badge variant="secondary" className="ml-auto">
            выполнено
          </Badge>
        )}
      </button>
      <Button size="icon-sm" variant="ghost" disabled={index === 0} onClick={() => onMove("up")}>
        <ChevronUp className="size-3.5" />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={index === total - 1}
        onClick={() => onMove("down")}
      >
        <ChevronDown className="size-3.5" />
      </Button>
      <Button size="icon-sm" variant="ghost" onClick={onRemove}>
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

function WorkSectionRow({
  session,
  section,
  workSection,
  exercises,
  index,
  total,
  onMove,
  onRemove,
  onOpenExercise,
  onMoveExercise,
  onRemoveExercise,
  onAddExerciseClick,
}: {
  session: Program2Session;
  section: Program2Section;
  workSection: WorkSection | undefined;
  exercises: Exercise[];
  index: number;
  total: number;
  onMove: (direction: "up" | "down") => void;
  onRemove: () => void;
  onOpenExercise: (exerciseInstanceId: string) => void;
  onMoveExercise: (exerciseInstanceId: string, direction: "up" | "down") => void;
  onRemoveExercise: (exerciseInstanceId: string) => void;
  onAddExerciseClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
    data: { type: "work-section", sessionId: session.id, sectionId: section.id },
  });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("flex flex-col gap-1.5 rounded-lg border bg-muted/20 p-2", isDragging && "opacity-50")}
    >
      <div className="flex items-center gap-1.5">
        <Button type="button" size="icon-sm" variant="ghost" onClick={() => setCollapsed((v) => !v)}>
          {collapsed ? <Plus className="size-3.5" /> : <Minus className="size-3.5" />}
        </Button>
        <div
          className="flex-1 cursor-grab rounded-md px-1.5 py-0.5 text-sm font-medium text-foreground"
          {...listeners}
          {...attributes}
        >
          {workSection?.title ?? "Раздел"}
        </div>
        <Button size="icon-sm" variant="ghost" disabled={index === 0} onClick={() => onMove("up")}>
          <ChevronUp className="size-3.5" />
        </Button>
        <Button size="icon-sm" variant="ghost" disabled={index === total - 1} onClick={() => onMove("down")}>
          <ChevronDown className="size-3.5" />
        </Button>
        <Button size="icon-sm" variant="ghost" onClick={onRemove}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-1.5 pl-7">
          <SortableContext items={section.exercises.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            {section.exercises.map((entry, exIndex) => (
              <WorkExerciseRow
                key={entry.id}
                session={session}
                section={section}
                entry={entry}
                exercise={exercises.find((e) => e.id === entry.exerciseId)}
                index={exIndex}
                total={section.exercises.length}
                onOpen={() => onOpenExercise(entry.id)}
                onMove={(direction) => onMoveExercise(entry.id, direction)}
                onRemove={() => onRemoveExercise(entry.id)}
              />
            ))}
          </SortableContext>
          <Button
            size="sm"
            variant="outline"
            className="w-fit gap-1.5"
            onClick={onAddExerciseClick}
          >
            <Plus className="size-3.5" /> Добавить упражнение
          </Button>
        </div>
      )}
    </div>
  );
}

function WorkSessionRow({
  session,
  index,
  rooms,
  workSections,
  exercises,
  onEdit,
  onRemove,
  onOpenExercise,
  onMoveSection,
  onRemoveSection,
  onMoveExercise,
  onRemoveExercise,
  onAddSectionClick,
  onAddExerciseClick,
}: {
  session: Program2Session;
  index: number;
  rooms: Room[];
  workSections: WorkSection[];
  exercises: Exercise[];
  onEdit: () => void;
  onRemove: () => void;
  onOpenExercise: (sectionId: string, exerciseInstanceId: string) => void;
  onMoveSection: (sectionId: string, direction: "up" | "down") => void;
  onRemoveSection: (sectionId: string) => void;
  onMoveExercise: (sectionId: string, exerciseInstanceId: string, direction: "up" | "down") => void;
  onRemoveExercise: (sectionId: string, exerciseInstanceId: string) => void;
  onAddSectionClick: () => void;
  onAddExerciseClick: (sectionId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `work-session:${session.id}`,
    data: { type: "work-session", sessionId: session.id },
  });
  const [collapsed, setCollapsed] = useState(false);
  const room = rooms.find((r) => r.id === session.roomId);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-card p-3",
        isOver && "border-primary/60 bg-accent/30",
      )}
    >
      <div className="flex items-start gap-1.5">
        <Button type="button" size="icon-sm" variant="ghost" onClick={() => setCollapsed((v) => !v)}>
          {collapsed ? <Plus className="size-3.5" /> : <Minus className="size-3.5" />}
        </Button>
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-md px-1.5 py-0.5 text-left hover:bg-accent/30"
        >
          <p className="text-sm font-medium text-foreground">Занятие {index + 1}</p>
          <p className="text-xs text-muted-foreground">
            {session.date ?? "Дата не указана"}
            {session.startTime && session.endTime ? ` · ${session.startTime}–${session.endTime}` : ""}
            {" · "}
            {session.location === "room" ? `Кабинет: ${room?.name ?? "—"}` : "Дома"}
          </p>
        </button>
        <Button size="icon-sm" variant="ghost" onClick={onRemove}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-2 pl-7">
          <SortableContext items={session.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {session.sections.map((section, secIndex) => (
              <WorkSectionRow
                key={section.id}
                session={session}
                section={section}
                workSection={workSections.find((s) => s.id === section.sectionId)}
                exercises={exercises}
                index={secIndex}
                total={session.sections.length}
                onMove={(direction) => onMoveSection(section.id, direction)}
                onRemove={() => onRemoveSection(section.id)}
                onOpenExercise={(exerciseInstanceId) => onOpenExercise(section.id, exerciseInstanceId)}
                onMoveExercise={(exerciseInstanceId, direction) =>
                  onMoveExercise(section.id, exerciseInstanceId, direction)
                }
                onRemoveExercise={(exerciseInstanceId) => onRemoveExercise(section.id, exerciseInstanceId)}
                onAddExerciseClick={() => onAddExerciseClick(section.id)}
              />
            ))}
          </SortableContext>
          <Button size="sm" variant="outline" className="w-fit gap-1.5" onClick={onAddSectionClick}>
            <Plus className="size-3.5" /> Добавить раздел
          </Button>
        </div>
      )}
    </div>
  );
}

export function Program2WorkPane({
  sessions,
  rooms,
  exercises,
  workSections,
  callbacks,
}: {
  sessions: Program2Session[];
  rooms: Room[];
  exercises: Exercise[];
  workSections: WorkSection[];
  callbacks: WorkPaneCallbacks;
}) {
  const { setNodeRef: setRootRef, isOver: isOverRoot } = useDroppable({
    id: "work-root",
    data: { type: "work-root" },
  });

  const [sessionModal, setSessionModal] = useState<{ session: Program2Session | null } | null>(
    null,
  );
  const [sectionPicker, setSectionPicker] = useState<{ sessionId: string } | null>(null);
  const [exercisePicker, setExercisePicker] = useState<{
    sessionId: string;
    sectionId: string;
    workSectionId: string;
  } | null>(null);
  const [exerciseModal, setExerciseModal] = useState<{
    sessionId: string;
    sectionId: string;
    entry: Program2Exercise;
    exercise: Exercise | undefined;
    location: "home" | "room" | null;
  } | null>(null);
  const [confirm, setConfirm] = useState<{ message: string; action: () => void } | null>(null);

  function reorder<T extends { id: string }>(list: T[], id: string, direction: "up" | "down") {
    const index = list.findIndex((item) => item.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || target < 0 || target >= list.length) return list.map((i) => i.id);
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    return next.map((i) => i.id);
  }

  function openExerciseModal(session: Program2Session, sectionId: string, exerciseInstanceId: string) {
    const section = session.sections.find((s) => s.id === sectionId);
    const entry = section?.exercises.find((e) => e.id === exerciseInstanceId);
    if (!entry) return;
    setExerciseModal({
      sessionId: session.id,
      sectionId,
      entry,
      exercise: exercises.find((e) => e.id === entry.exerciseId),
      location: session.location,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Рабочая программа</CardTitle>
        <CardDescription>Редактируемая программа занятий пациента.</CardDescription>
        <CardAction className="flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              setConfirm({
                message: "Очистить рабочую программу и заполнить автопрограммой?",
                action: callbacks.fillFromAuto,
              })
            }
          >
            Заполнить из автопрограммы
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              setConfirm({
                message: "Вы уверены, что нужно очистить рабочую программу?",
                action: callbacks.clearWork,
              })
            }
          >
            <Eraser className="size-3.5" /> Очистить
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div
          ref={setRootRef}
          className={cn(
            "flex flex-col gap-3 rounded-lg",
            isOverRoot && "outline-2 outline-dashed outline-primary/50",
          )}
        >
          {sessions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              В рабочей программе пока нет занятий. Добавьте занятие вручную или перетащите его из
              автоматической программы.
            </p>
          )}
          {sessions.map((session, index) => (
            <WorkSessionRow
              key={session.id}
              session={session}
              index={index}
              rooms={rooms}
              workSections={workSections}
              exercises={exercises}
              onEdit={() => setSessionModal({ session })}
              onRemove={() =>
                setConfirm({
                  message: `Удалить занятие ${index + 1}?`,
                  action: () => callbacks.removeSession(session.id),
                })
              }
              onOpenExercise={(sectionId, exerciseInstanceId) =>
                openExerciseModal(session, sectionId, exerciseInstanceId)
              }
              onMoveSection={(sectionId, direction) =>
                callbacks.reorderSections(session.id, reorder(session.sections, sectionId, direction))
              }
              onRemoveSection={(sectionId) =>
                setConfirm({
                  message: "Удалить раздел из занятия?",
                  action: () => callbacks.removeSection(session.id, sectionId),
                })
              }
              onMoveExercise={(sectionId, exerciseInstanceId, direction) => {
                const section = session.sections.find((s) => s.id === sectionId);
                if (!section) return;
                callbacks.reorderExercises(
                  session.id,
                  sectionId,
                  reorder(section.exercises, exerciseInstanceId, direction),
                );
              }}
              onRemoveExercise={(sectionId, exerciseInstanceId) =>
                setConfirm({
                  message: "Удалить упражнение из раздела?",
                  action: () => callbacks.removeExercise(session.id, sectionId, exerciseInstanceId),
                })
              }
              onAddSectionClick={() => setSectionPicker({ sessionId: session.id })}
              onAddExerciseClick={(sectionId) => {
                const section = session.sections.find((s) => s.id === sectionId);
                if (!section) return;
                setExercisePicker({
                  sessionId: session.id,
                  sectionId,
                  workSectionId: section.sectionId,
                });
              }}
            />
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-fit gap-1.5"
          onClick={() => setSessionModal({ session: null })}
        >
          <Plus className="size-3.5" /> Добавить занятие
        </Button>
      </CardContent>

      <Program2SessionModal
        open={!!sessionModal}
        onOpenChange={(open) => !open && setSessionModal(null)}
        rooms={rooms}
        session={sessionModal?.session}
        onSubmit={(details) => {
          if (sessionModal?.session) {
            callbacks.updateSession(sessionModal.session.id, details);
          } else {
            callbacks.addSession(details);
          }
        }}
      />

      <Program2ItemPicker
        open={!!sectionPicker}
        onOpenChange={(open) => !open && setSectionPicker(null)}
        title="Добавить раздел"
        description="Выберите раздел логопедической работы"
        placeholder="Выберите раздел"
        emptyMessage="Все разделы уже добавлены в это занятие."
        options={(() => {
          if (!sectionPicker) return [];
          const session = sessions.find((s) => s.id === sectionPicker.sessionId);
          const used = new Set(session?.sections.map((s) => s.sectionId));
          return workSections
            .filter((s) => !used.has(s.id))
            .map((s) => ({ id: s.id, label: s.title }));
        })()}
        onPick={(workSectionId) => {
          if (!sectionPicker) return;
          callbacks.addSection(sectionPicker.sessionId, workSectionId);
        }}
      />

      <Program2ItemPicker
        open={!!exercisePicker}
        onOpenChange={(open) => !open && setExercisePicker(null)}
        title="Добавить упражнение"
        description="Выберите упражнение из банка, соответствующее разделу"
        placeholder="Выберите упражнение"
        emptyMessage="Нет подходящих упражнений для этого раздела."
        options={(() => {
          if (!exercisePicker) return [];
          const session = sessions.find((s) => s.id === exercisePicker.sessionId);
          const section = session?.sections.find((s) => s.id === exercisePicker.sectionId);
          const used = new Set(section?.exercises.map((e) => e.exerciseId));
          return exercises
            .filter((e) => e.sectionIds.includes(exercisePicker.workSectionId) && !used.has(e.id))
            .map((e) => ({ id: e.id, label: e.title }));
        })()}
        onPick={(exerciseId) => {
          if (!exercisePicker) return;
          callbacks.addExercise(exercisePicker.sessionId, exercisePicker.sectionId, exerciseId);
        }}
      />

      <Program2ExerciseModal
        open={!!exerciseModal}
        onOpenChange={(open) => !open && setExerciseModal(null)}
        exercise={exerciseModal?.exercise}
        entry={exerciseModal?.entry}
        location={exerciseModal?.location ?? null}
        onComplete={(ratings, autoGraded) => {
          if (!exerciseModal) return;
          callbacks.rateExercise(
            exerciseModal.sessionId,
            exerciseModal.sectionId,
            exerciseModal.entry.id,
            ratings,
            autoGraded,
          );
        }}
      />

      <AlertDialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение</AlertDialogTitle>
            <AlertDialogDescription>{confirm?.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Нет</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                confirm?.action();
              }}
            >
              Да
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
