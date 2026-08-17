import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useAppState } from "@/context/AppStateContext";
import { Button } from "@/components/ui/button";
import { Program2AutoPane } from "@/components/app/program2/Program2AutoPane";
import { Program2WorkPane } from "@/components/app/program2/Program2WorkPane";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DragItemData {
  type: "work-root" | "work-session" | "work-section" | "work-exercise";
  sessionId?: string;
  sectionId?: string;
  exerciseId?: string;
}

export function Program2Tab({ patientId }: { patientId: string }) {
  const {
    getPatient,
    rooms,
    exercises,
    workSections,
    buildProgram2Auto,
    fillProgram2WorkFromAuto,
    clearProgram2Work,
    addProgram2Session,
    updateProgram2Session,
    removeProgram2Session,
    addProgram2Section,
    removeProgram2Section,
    reorderProgram2Sections,
    addProgram2Exercise,
    removeProgram2Exercise,
    reorderProgram2Exercises,
    setProgram2ExerciseRating,
    copyAutoSessionToWork,
    copyAutoSectionToWork,
    copyAutoExerciseToWork,
  } = useAppState();

  const patient = getPatient(patientId);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  if (!patient) return null;

  function handleDragEnd(event: DragEndEvent) {
    if (!patient) return;
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overData = over.data.current as DragItemData | undefined;
    if (!overData) return;

    if (activeId.startsWith("auto-session:")) {
      const autoSessionId = activeId.slice("auto-session:".length);
      if (overData.type === "work-root" || overData.type === "work-session") {
        copyAutoSessionToWork(patientId, autoSessionId);
      }
      return;
    }

    if (activeId.startsWith("auto-section:")) {
      const [, autoSessionId, autoSectionId] = activeId.split(":");
      if (
        (overData.type === "work-session" || overData.type === "work-section") &&
        overData.sessionId
      ) {
        copyAutoSectionToWork(patientId, autoSessionId, autoSectionId, overData.sessionId);
      }
      return;
    }

    if (activeId.startsWith("auto-exercise:")) {
      const [, autoSessionId, autoSectionId, autoExerciseId] = activeId.split(":");
      if (
        (overData.type === "work-section" || overData.type === "work-exercise") &&
        overData.sessionId &&
        overData.sectionId
      ) {
        copyAutoExerciseToWork(
          patientId,
          autoSessionId,
          autoSectionId,
          autoExerciseId,
          overData.sessionId,
          overData.sectionId,
        );
      }
      return;
    }

    if (activeId === String(over.id)) return;
    const activeData = active.data.current as DragItemData | undefined;
    if (!activeData) return;

    if (
      activeData.type === "work-section" &&
      overData.type === "work-section" &&
      activeData.sessionId === overData.sessionId &&
      activeData.sessionId
    ) {
      const session = patient.program2Work.find((s) => s.id === activeData.sessionId);
      if (!session) return;
      const oldIndex = session.sections.findIndex((s) => s.id === activeId);
      const newIndex = session.sections.findIndex((s) => s.id === String(over.id));
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = arrayMove(session.sections, oldIndex, newIndex).map((s) => s.id);
      reorderProgram2Sections(patientId, session.id, reordered);
      return;
    }

    if (
      activeData.type === "work-exercise" &&
      overData.type === "work-exercise" &&
      activeData.sessionId === overData.sessionId &&
      activeData.sectionId === overData.sectionId &&
      activeData.sessionId &&
      activeData.sectionId
    ) {
      const session = patient.program2Work.find((s) => s.id === activeData.sessionId);
      if (!session) return;
      const section = session.sections.find((sec) => sec.id === activeData.sectionId);
      if (!section) return;
      const oldIndex = section.exercises.findIndex((e) => e.id === activeId);
      const newIndex = section.exercises.findIndex((e) => e.id === String(over.id));
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = arrayMove(section.exercises, oldIndex, newIndex).map((e) => e.id);
      reorderProgram2Exercises(patientId, session.id, section.id, reordered);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        {!leftCollapsed && (
          <div className="lg:w-[30%]">
            <Program2AutoPane
              sessions={patient.program2Auto}
              built={patient.program2AutoBuilt}
              rooms={rooms}
              exercises={exercises}
              workSections={workSections}
              onBuild={() => buildProgram2Auto(patientId)}
            />
          </div>
        )}

        <div className="hidden lg:flex lg:flex-col lg:items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setLeftCollapsed((v) => !v)}
            title={leftCollapsed ? "Показать автоматическую программу" : "Свернуть автоматическую программу"}
          >
            {leftCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        </div>
        {leftCollapsed && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit gap-1.5 lg:hidden"
            onClick={() => setLeftCollapsed(false)}
          >
            <ChevronRight className="size-4" /> Автоматическая программа
          </Button>
        )}

        <div className="flex flex-col gap-2 lg:flex-1">
          <Program2WorkPane
            sessions={patient.program2Work}
            rooms={rooms}
            exercises={exercises}
            workSections={workSections}
            callbacks={{
              fillFromAuto: () => fillProgram2WorkFromAuto(patientId),
              clearWork: () => clearProgram2Work(patientId),
              addSession: (details) => addProgram2Session(patientId, details),
              updateSession: (sessionId, details) =>
                updateProgram2Session(patientId, sessionId, details),
              removeSession: (sessionId) => removeProgram2Session(patientId, sessionId),
              addSection: (sessionId, workSectionId) =>
                addProgram2Section(patientId, sessionId, workSectionId),
              removeSection: (sessionId, sectionInstanceId) =>
                removeProgram2Section(patientId, sessionId, sectionInstanceId),
              reorderSections: (sessionId, orderedIds) =>
                reorderProgram2Sections(patientId, sessionId, orderedIds),
              addExercise: (sessionId, sectionInstanceId, exerciseId) =>
                addProgram2Exercise(patientId, sessionId, sectionInstanceId, exerciseId),
              removeExercise: (sessionId, sectionInstanceId, exerciseInstanceId) =>
                removeProgram2Exercise(patientId, sessionId, sectionInstanceId, exerciseInstanceId),
              reorderExercises: (sessionId, sectionInstanceId, orderedIds) =>
                reorderProgram2Exercises(patientId, sessionId, sectionInstanceId, orderedIds),
              rateExercise: (sessionId, sectionInstanceId, exerciseInstanceId, ratings, autoGraded) =>
                setProgram2ExerciseRating(
                  patientId,
                  sessionId,
                  sectionInstanceId,
                  exerciseInstanceId,
                  ratings,
                  autoGraded,
                ),
            }}
          />
        </div>
      </div>
    </DndContext>
  );
}
