import type { Exercise, Program2Session, Room, WorkSection } from "@/data/types";

export type Program2ScheduleDetails =
  | { location: "home"; date: string | null }
  | { location: "room"; roomId: string; date: string; startTime: string; endTime: string };

export interface Program2ExerciseScheduleDetails {
  done: boolean;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  roomId: string | null;
}

function parseRuDate(date: string): number {
  const [d, m, y] = date.split(".").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function sortProgram2Sessions(sessions: Program2Session[]): Program2Session[] {
  return [...sessions].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    const dateDiff = parseRuDate(a.date) - parseRuDate(b.date);
    if (dateDiff !== 0) return dateDiff;
    return (a.startTime ?? "").localeCompare(b.startTime ?? "");
  });
}

export function formatRuDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${d}.${m}.${date.getFullYear()}`;
}

export function parseRuDateToDate(date: string): Date {
  const [d, m, y] = date.split(".").map(Number);
  return new Date(y, m - 1, d);
}

const SLOTS = [
  { startTime: "10:00", endTime: "10:30" },
  { startTime: "14:00", endTime: "14:30" },
];

export function buildAutoProgram2(
  patientId: string,
  exercises: Exercise[],
  workSections: WorkSection[],
  rooms: Room[],
): Program2Session[] {
  const sectionsWithExercises = workSections.filter((section) =>
    exercises.some((ex) => ex.sectionIds.includes(section.id)),
  );
  if (sectionsWithExercises.length === 0) return [];

  const sessionCount = Math.min(3, Math.max(1, Math.ceil(sectionsWithExercises.length / 2)));
  const roomId = rooms[0]?.id ?? null;
  const now = Date.now();

  return Array.from({ length: sessionCount }, (_, sessionIndex) => {
    const sectionSlice = sectionsWithExercises.slice(
      sessionIndex * 2,
      sessionIndex * 2 + 2,
    );
    const sections = (sectionSlice.length > 0 ? sectionSlice : sectionsWithExercises.slice(0, 2)).map(
      (section, sectionIndex) => {
        const sectionExercises = exercises.filter((ex) => ex.sectionIds.includes(section.id));
        const exerciseCount = Math.min(2, sectionExercises.length);
        return {
          id: `ps-${now}-${sessionIndex}-${sectionIndex}`,
          sectionId: section.id,
          exercises: Array.from({ length: exerciseCount }, (_, exIndex) => ({
            id: `pe-${now}-${sessionIndex}-${sectionIndex}-${exIndex}`,
            exerciseId: sectionExercises[exIndex].id,
            done: false,
            autoGraded: false,
            ratings: { accuracy: null, independence: null, pace: null },
            date: null,
            startTime: null,
            endTime: null,
            roomId: null,
          })),
        };
      },
    );

    const location = sessionIndex % 2 === 0 ? "room" : "home";
    const date = new Date();
    date.setDate(date.getDate() + sessionIndex + 1);
    const slot = SLOTS[sessionIndex % SLOTS.length];

    return {
      id: `p2s-${patientId}-${now}-${sessionIndex}`,
      location,
      roomId: location === "room" ? roomId : null,
      date: formatRuDate(date),
      startTime: slot.startTime,
      endTime: slot.endTime,
      sections,
    };
  });
}
