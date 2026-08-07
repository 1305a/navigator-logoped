import type { TherapySession } from "@/data/types";

export type SessionStatus = "completed" | "available" | "locked";

export function buildSessions(
  patientId: string,
  exercisePool: string[],
  sessionCount: number,
  perSession = 2,
): TherapySession[] {
  return Array.from({ length: sessionCount }, (_, i) => {
    const exerciseIds = Array.from({ length: perSession }, (_, j) => {
      const index = (i * perSession + j) % exercisePool.length;
      return exercisePool[index];
    });
    return {
      id: `${patientId}-s${i + 1}`,
      order: i + 1,
      title: `Занятие ${i + 1}`,
      exercises: exerciseIds.map((exerciseId) => ({ exerciseId, done: false })),
      grade: null,
      completedDate: null,
      location: null,
      roomId: null,
      scheduledDate: null,
      startTime: null,
      endTime: null,
      bookingId: null,
    };
  });
}

export function renumberSessions(sessions: TherapySession[]): TherapySession[] {
  return sessions.map((s, i) => ({ ...s, order: i + 1, title: `Занятие ${i + 1}` }));
}

export function getSessionStatus(
  session: TherapySession,
  sessions: TherapySession[],
): SessionStatus {
  if (session.grade !== null) return "completed";
  if (session.order === 1) return "available";
  const previous = sessions.find((s) => s.order === session.order - 1);
  if (previous && previous.grade !== null) return "available";
  return "locked";
}

export function getCurrentSession(sessions: TherapySession[]): TherapySession | undefined {
  return sessions.find((s) => getSessionStatus(s, sessions) === "available");
}

export function getSessionProgress(sessions: TherapySession[]): {
  done: number;
  total: number;
  fraction: number;
} {
  const done = sessions.filter((s) => s.grade !== null).length;
  const total = sessions.length;
  return { done, total, fraction: total === 0 ? 0 : done / total };
}
