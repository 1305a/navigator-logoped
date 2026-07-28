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
import { buildSessions } from "@/lib/therapy";

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
  gradeSession: (patientId: string, sessionId: string, grade: number) => void;
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
      createProgram,
      setSessionExerciseDone,
      gradeSession,
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
