import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  Appointment,
  DemoUser,
  DiaryEntry,
  Patient,
  PatientInfo,
  SpeechCard,
  StaffMember,
} from "@/data/types";
import { demoUsers } from "@/data/users";
import { initialPatients } from "@/data/patients";
import { appointments as initialAppointments } from "@/data/appointments";
import { initialDiaryEntries } from "@/data/diary";
import { initialStaff } from "@/data/staff";
import { fundingTypes } from "@/data/misc";
import { buildSessions, renumberSessions } from "@/lib/therapy";

interface InstitutionSettings {
  name: string;
  funding: string[];
}

interface AppStateValue {
  currentUser: DemoUser | null;
  login: (userId: string) => void;
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
  addTherapySession: (patientId: string) => void;
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
  const [institution, setInstitution] = useState<InstitutionSettings>({
    name: "Центр логопедической реабилитации «Навигатор»",
    funding: fundingTypes.filter((f) => f.id === "oms" || f.id === "paid").map((f) => f.id),
  });

  const login = (userId: string) => {
    const user = demoUsers.find((u) => u.id === userId) ?? null;
    setCurrentUser(user);
  };

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

  const addTherapySession = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const newSession = {
          id: `${patientId}-s${Date.now()}`,
          order: p.sessions.length + 1,
          title: `Занятие ${p.sessions.length + 1}`,
          exercises: [],
          grade: null,
          completedDate: null,
        };
        return { ...p, sessions: renumberSessions([...p.sessions, newSession]) };
      }),
    );
  };

  const removeTherapySession = (patientId: string, sessionId: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, sessions: renumberSessions(p.sessions.filter((s) => s.id !== sessionId)) }
          : p,
      ),
    );
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

  const addAppointment = (appointment: Appointment) =>
    setAppointments((prev) => [...prev, appointment]);

  const addDiaryEntry = (entry: DiaryEntry) => setDiaryEntries((prev) => [entry, ...prev]);

  const addStaffMember = (member: StaffMember) => setStaff((prev) => [...prev, member]);

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
      institution,
      updateInstitution,
    }),
    [currentUser, patients, appointments, diaryEntries, staff, institution],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
