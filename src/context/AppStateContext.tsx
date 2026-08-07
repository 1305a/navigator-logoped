import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  Appointment,
  DemoUser,
  DiaryEntry,
  Patient,
  PatientInfo,
  Position,
  Room,
  SpeechCard,
  StaffMember,
  TherapySession,
} from "@/data/types";
import { initialPatients } from "@/data/patients";
import { appointments as initialAppointments } from "@/data/appointments";
import { initialDiaryEntries } from "@/data/diary";
import { initialStaff } from "@/data/staff";
import { initialPositions } from "@/data/positions";
import { initialRooms } from "@/data/rooms";
import { buildSessions, renumberSessions } from "@/lib/therapy";

type SessionScheduleDetails =
  | { location: "home" }
  | { location: "room"; roomId: string; date: string; startTime: string; endTime: string };

interface InstitutionSettings {
  name: string;
  address: string;
  shortName: string;
  headDoctorId: string;
  facilityType: string;
  institutionType: string;
  bedFunction: number;
  sortOrder: number;
}

interface AppStateValue {
  currentUser: DemoUser | null;
  login: (user: DemoUser) => void;
  logout: () => void;

  patients: Patient[];
  getPatient: (id: string) => Patient | undefined;
  saveSpeechCard: (patientId: string, card: SpeechCard) => void;
  suggestDisorderType: (patientId: string, text: string) => void;
  approveDisorderType: (patientId: string) => void;
  rejectDisorderType: (patientId: string) => void;
  suggestDiagnosis: (patientId: string, text: string) => void;
  approveDiagnosis: (patientId: string) => void;
  rejectDiagnosis: (patientId: string) => void;
  createProgram: (
    patientId: string,
    summary: string,
    exerciseIds: string[],
    sessionCount?: number,
  ) => void;
  setSessionExerciseDone: (
    patientId: string,
    sessionId: string,
    exerciseId: string,
    done: boolean,
  ) => void;
  addSessionExercise: (patientId: string, sessionId: string, exerciseId: string) => void;
  removeSessionExercise: (patientId: string, sessionId: string, exerciseId: string) => void;
  gradeSession: (patientId: string, sessionId: string, grade: number) => void;
  addTherapySession: (patientId: string, details: SessionScheduleDetails) => void;
  updateSessionSchedule: (
    patientId: string,
    sessionId: string,
    details: SessionScheduleDetails,
  ) => void;
  removeTherapySession: (patientId: string, sessionId: string) => void;
  moveTherapySession: (patientId: string, sessionId: string, direction: "up" | "down") => void;
  addPatient: (patient: Patient) => void;
  updatePatientInfo: (patientId: string, info: PatientInfo) => void;

  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;

  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: DiaryEntry) => void;

  staff: StaffMember[];
  addStaffMember: (member: StaffMember) => void;
  updateStaffMember: (staffId: string, updates: Omit<StaffMember, "id">) => void;

  positions: Position[];
  addPosition: (position: Position) => void;
  updatePosition: (positionId: string, title: string) => void;
  removePosition: (positionId: string) => void;

  rooms: Room[];
  addRoom: (room: Room) => void;
  updateRoom: (roomId: string, name: string) => void;
  removeRoom: (roomId: string) => void;

  institution: InstitutionSettings;
  updateInstitution: (settings: InstitutionSettings) => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(initialDiaryEntries);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [institution, setInstitution] = useState<InstitutionSettings>({
    name: "Центр логопедической реабилитации «Навигатор»",
    address: "г. Москва, ул. Речевая, д. 5",
    shortName: "Навигатор",
    headDoctorId: initialStaff.find((s) => s.role === "admin")?.id ?? "",
    facilityType: "Реабилитационный центр",
    institutionType: "Логопедический центр",
    bedFunction: 0,
    sortOrder: 1,
  });

  const login = (user: DemoUser) => setCurrentUser(user);

  const logout = () => setCurrentUser(null);

  const getPatient = (id: string) => patients.find((p) => p.id === id);

  const saveSpeechCard = (patientId: string, card: SpeechCard) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, speechCard: card } : p)),
    );
  };

  const suggestDisorderType = (patientId: string, text: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, suggestedDisorderType: text, disorderTypeStatus: "pending" }
          : p,
      ),
    );
  };

  const approveDisorderType = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, disorderTypeStatus: "approved" } : p)),
    );
  };

  const rejectDisorderType = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, disorderTypeStatus: "rejected" } : p)),
    );
  };

  const suggestDiagnosis = (patientId: string, text: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, suggestedDiagnosis: text, diagnosisStatus: "pending" }
          : p,
      ),
    );
  };

  const approveDiagnosis = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, diagnosisStatus: "approved" } : p)),
    );
  };

  const rejectDiagnosis = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, diagnosisStatus: "rejected" } : p)),
    );
  };

  const createProgram = (
    patientId: string,
    summary: string,
    exerciseIds: string[],
    sessionCount = 6,
  ) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              programCreated: true,
              programSummary: summary,
              sessions: buildSessions(patientId, exerciseIds, sessionCount),
            }
          : p,
      ),
    );
  };

  const setSessionExerciseDone = (
    patientId: string,
    sessionId: string,
    exerciseId: string,
    done: boolean,
  ) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              sessions: p.sessions.map((s) =>
                s.id === sessionId
                  ? {
                      ...s,
                      exercises: s.exercises.map((ex) =>
                        ex.exerciseId === exerciseId ? { ...ex, done } : ex,
                      ),
                    }
                  : s,
              ),
            }
          : p,
      ),
    );
  };

  const addSessionExercise = (patientId: string, sessionId: string, exerciseId: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              sessions: p.sessions.map((s) =>
                s.id === sessionId && !s.exercises.some((ex) => ex.exerciseId === exerciseId)
                  ? { ...s, exercises: [...s.exercises, { exerciseId, done: false }] }
                  : s,
              ),
            }
          : p,
      ),
    );
  };

  const removeSessionExercise = (patientId: string, sessionId: string, exerciseId: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              sessions: p.sessions.map((s) =>
                s.id === sessionId
                  ? { ...s, exercises: s.exercises.filter((ex) => ex.exerciseId !== exerciseId) }
                  : s,
              ),
            }
          : p,
      ),
    );
  };

  const gradeSession = (patientId: string, sessionId: string, grade: number) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              sessions: p.sessions.map((s) =>
                s.id === sessionId ? { ...s, grade, completedDate: "28.07.2026" } : s,
              ),
            }
          : p,
      ),
    );
  };

  const addTherapySession = (patientId: string, details: SessionScheduleDetails) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;
    const order = patient.sessions.length + 1;
    const title = `Занятие ${order}`;
    const bookingId = details.location === "room" ? `rb-${Date.now()}` : null;

    const newSession: TherapySession = {
      id: `${patientId}-s${Date.now()}`,
      order,
      title,
      exercises: [],
      grade: null,
      completedDate: null,
      location: details.location,
      roomId: details.location === "room" ? details.roomId : null,
      scheduledDate: details.location === "room" ? details.date : null,
      startTime: details.location === "room" ? details.startTime : null,
      endTime: details.location === "room" ? details.endTime : null,
      bookingId,
    };

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, sessions: renumberSessions([...p.sessions, newSession]) } : p,
      ),
    );

    if (details.location === "room" && bookingId) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === details.roomId
            ? {
                ...r,
                bookings: [
                  ...r.bookings,
                  {
                    id: bookingId,
                    date: details.date,
                    startTime: details.startTime,
                    endTime: details.endTime,
                    doctorName: currentUser?.fullName ?? "",
                    patientName: patient.fullName,
                    sessionTitle: title,
                  },
                ],
              }
            : r,
        ),
      );
    }
  };

  const updateSessionSchedule = (
    patientId: string,
    sessionId: string,
    details: SessionScheduleDetails,
  ) => {
    const patient = patients.find((p) => p.id === patientId);
    const session = patient?.sessions.find((s) => s.id === sessionId);
    if (!patient || !session) return;

    if (session.roomId && session.bookingId) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === session.roomId
            ? { ...r, bookings: r.bookings.filter((b) => b.id !== session.bookingId) }
            : r,
        ),
      );
    }

    const bookingId = details.location === "room" ? `rb-${Date.now()}` : null;

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              sessions: p.sessions.map((s) =>
                s.id === sessionId
                  ? {
                      ...s,
                      location: details.location,
                      roomId: details.location === "room" ? details.roomId : null,
                      scheduledDate: details.location === "room" ? details.date : null,
                      startTime: details.location === "room" ? details.startTime : null,
                      endTime: details.location === "room" ? details.endTime : null,
                      bookingId,
                    }
                  : s,
              ),
            }
          : p,
      ),
    );

    if (details.location === "room" && bookingId) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === details.roomId
            ? {
                ...r,
                bookings: [
                  ...r.bookings,
                  {
                    id: bookingId,
                    date: details.date,
                    startTime: details.startTime,
                    endTime: details.endTime,
                    doctorName: currentUser?.fullName ?? "",
                    patientName: patient.fullName,
                    sessionTitle: session.title,
                  },
                ],
              }
            : r,
        ),
      );
    }
  };

  const removeTherapySession = (patientId: string, sessionId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    const session = patient?.sessions.find((s) => s.id === sessionId);

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, sessions: renumberSessions(p.sessions.filter((s) => s.id !== sessionId)) }
          : p,
      ),
    );

    if (session?.roomId && session.bookingId) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === session.roomId
            ? { ...r, bookings: r.bookings.filter((b) => b.id !== session.bookingId) }
            : r,
        ),
      );
    }
  };

  const moveTherapySession = (
    patientId: string,
    sessionId: string,
    direction: "up" | "down",
  ) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const index = p.sessions.findIndex((s) => s.id === sessionId);
        if (index === -1) return p;
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= p.sessions.length) return p;
        const next = [...p.sessions];
        [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
        return { ...p, sessions: renumberSessions(next) };
      }),
    );
  };

  const addPatient = (patient: Patient) => setPatients((prev) => [...prev, patient]);

  const updatePatientInfo = (patientId: string, info: PatientInfo) => {
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, info } : p)));
  };

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment]);

    if (appointment.roomId && appointment.roomStartTime && appointment.roomEndTime) {
      const roomId = appointment.roomId;
      const startTime = appointment.roomStartTime;
      const endTime = appointment.roomEndTime;
      setRooms((prev) =>
        prev.map((r) =>
          r.id === roomId
            ? {
                ...r,
                bookings: [
                  ...r.bookings,
                  {
                    id: `rb-${Date.now()}`,
                    date: appointment.date,
                    startTime,
                    endTime,
                    doctorName: appointment.doctorName ?? "",
                    patientName: appointment.patientName,
                    sessionTitle: appointment.type,
                  },
                ],
              }
            : r,
        ),
      );
    }
  };

  const addDiaryEntry = (entry: DiaryEntry) => setDiaryEntries((prev) => [entry, ...prev]);

  const addStaffMember = (member: StaffMember) => setStaff((prev) => [...prev, member]);

  const updateStaffMember = (staffId: string, updates: Omit<StaffMember, "id">) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, ...updates } : s)));
  };

  const addPosition = (position: Position) => setPositions((prev) => [...prev, position]);

  const updatePosition = (positionId: string, title: string) => {
    setPositions((prev) => prev.map((p) => (p.id === positionId ? { ...p, title } : p)));
  };

  const removePosition = (positionId: string) => {
    setPositions((prev) => prev.filter((p) => p.id !== positionId));
  };

  const addRoom = (room: Room) => setRooms((prev) => [...prev, room]);

  const updateRoom = (roomId: string, name: string) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, name } : r)));
  };

  const removeRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const updateInstitution = (settings: InstitutionSettings) => setInstitution(settings);

  const value = useMemo<AppStateValue>(
    () => ({
      currentUser,
      login,
      logout,
      patients,
      getPatient,
      saveSpeechCard,
      suggestDisorderType,
      approveDisorderType,
      rejectDisorderType,
      suggestDiagnosis,
      approveDiagnosis,
      rejectDiagnosis,
      createProgram,
      setSessionExerciseDone,
      addSessionExercise,
      removeSessionExercise,
      gradeSession,
      addTherapySession,
      updateSessionSchedule,
      removeTherapySession,
      moveTherapySession,
      addPatient,
      updatePatientInfo,
      appointments,
      addAppointment,
      diaryEntries,
      addDiaryEntry,
      staff,
      addStaffMember,
      updateStaffMember,
      positions,
      addPosition,
      updatePosition,
      removePosition,
      rooms,
      addRoom,
      updateRoom,
      removeRoom,
      institution,
      updateInstitution,
    }),
    [currentUser, patients, appointments, diaryEntries, staff, positions, rooms, institution],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
