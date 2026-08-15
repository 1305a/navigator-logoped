import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  Appointment,
  AppRole,
  DemoUser,
  DiaryEntry,
  EmployeeActivityType,
  Exercise,
  OfflineExercise,
  Patient,
  PatientInfo,
  Position,
  Room,
  RoomType,
  SpeechCard,
  StaffBooking,
  StaffMember,
  TherapySession,
  TrainerCatalogEntry,
  WorkSection,
} from "@/data/types";
import { initialPatients } from "@/data/patients";
import { appointments as initialAppointments } from "@/data/appointments";
import { initialDiaryEntries } from "@/data/diary";
import { initialStaff } from "@/data/staff";
import { initialPositions } from "@/data/positions";
import { initialRooms } from "@/data/rooms";
import { initialRoomTypes } from "@/data/roomTypes";
import {
  initialEmployeeActivityTypes,
  PATIENT_APPOINTMENT_ACTIVITY,
  PATIENT_SESSION_ACTIVITY,
} from "@/data/employeeActivityTypes";
import { initialAppRoles } from "@/data/appRoles";
import { initialWorkSections } from "@/data/workSections";
import { initialExerciseBank } from "@/data/exercises";
import { initialTrainerCatalog } from "@/data/trainers";
import { initialOfflineExercises } from "@/data/offlineExercises";
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
  updateStaffMember: (staffId: string, updates: Omit<StaffMember, "id" | "bookings">) => void;
  addStaffBooking: (staffId: string, booking: Omit<StaffBooking, "id">) => void;

  activityTypes: EmployeeActivityType[];
  addActivityType: (activityType: EmployeeActivityType) => void;
  updateActivityType: (activityTypeId: string, title: string) => void;
  removeActivityType: (activityTypeId: string) => void;

  positions: Position[];
  addPosition: (position: Position) => void;
  updatePosition: (positionId: string, title: string) => void;
  removePosition: (positionId: string) => void;

  rooms: Room[];
  addRoom: (room: Room) => void;
  updateRoom: (roomId: string, updates: Omit<Room, "id" | "bookings">) => void;
  removeRoom: (roomId: string) => void;

  roomTypes: RoomType[];
  addRoomType: (roomType: RoomType) => void;
  updateRoomType: (roomTypeId: string, title: string) => void;
  removeRoomType: (roomTypeId: string) => void;

  appRoles: AppRole[];
  addAppRole: (role: AppRole) => void;
  updateAppRole: (roleId: string, updates: Omit<AppRole, "id">) => void;
  removeAppRole: (roleId: string) => void;

  workSections: WorkSection[];
  addWorkSection: (section: WorkSection) => void;
  updateWorkSection: (sectionId: string, title: string) => void;
  removeWorkSection: (sectionId: string) => void;

  exercises: Exercise[];
  getExercise: (id: string) => Exercise | undefined;
  addExerciseSection: (exerciseId: string, sectionId: string) => void;
  removeExerciseSection: (exerciseId: string, sectionId: string) => void;

  trainerCatalog: TrainerCatalogEntry[];
  addTrainerSection: (path: string, sectionId: string) => void;
  removeTrainerSection: (path: string, sectionId: string) => void;

  offlineExercises: OfflineExercise[];
  addOfflineExerciseSection: (exerciseId: string, sectionId: string) => void;
  removeOfflineExerciseSection: (exerciseId: string, sectionId: string) => void;

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
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(initialRoomTypes);
  const [activityTypes, setActivityTypes] = useState<EmployeeActivityType[]>(
    initialEmployeeActivityTypes,
  );
  const [appRoles, setAppRoles] = useState<AppRole[]>(initialAppRoles);
  const [workSections, setWorkSections] = useState<WorkSection[]>(initialWorkSections);
  const [exercises, setExercises] = useState<Exercise[]>(initialExerciseBank);
  const [trainerCatalog, setTrainerCatalog] = useState<TrainerCatalogEntry[]>(
    initialTrainerCatalog,
  );
  const [offlineExercises, setOfflineExercises] = useState<OfflineExercise[]>(
    initialOfflineExercises,
  );
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
    const roomBookingId = details.location === "room" ? `rb-${Date.now()}` : null;
    const staffBookingId = details.location === "room" ? `sb-${Date.now()}` : null;

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
      roomBookingId,
      staffBookingId,
    };

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, sessions: renumberSessions([...p.sessions, newSession]) } : p,
      ),
    );

    if (details.location === "room" && roomBookingId) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === details.roomId
            ? {
                ...r,
                bookings: [
                  ...r.bookings,
                  {
                    id: roomBookingId,
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

    if (details.location === "room" && staffBookingId && currentUser) {
      const doctorId = currentUser.id;
      setStaff((prev) =>
        prev.map((s) =>
          s.id === doctorId
            ? {
                ...s,
                bookings: [
                  ...s.bookings,
                  {
                    id: staffBookingId,
                    activityType: PATIENT_SESSION_ACTIVITY,
                    dateFrom: details.date,
                    dateTo: details.date,
                    startTime: details.startTime,
                    endTime: details.endTime,
                    note: patient.fullName,
                  },
                ],
              }
            : s,
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

    if (session.roomId && session.roomBookingId) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === session.roomId
            ? { ...r, bookings: r.bookings.filter((b) => b.id !== session.roomBookingId) }
            : r,
        ),
      );
    }

    if (session.staffBookingId) {
      setStaff((prev) =>
        prev.map((s) => ({
          ...s,
          bookings: s.bookings.filter((b) => b.id !== session.staffBookingId),
        })),
      );
    }

    const roomBookingId = details.location === "room" ? `rb-${Date.now()}` : null;
    const staffBookingId = details.location === "room" ? `sb-${Date.now()}` : null;

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
                      roomBookingId,
                      staffBookingId,
                    }
                  : s,
              ),
            }
          : p,
      ),
    );

    if (details.location === "room" && roomBookingId) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === details.roomId
            ? {
                ...r,
                bookings: [
                  ...r.bookings,
                  {
                    id: roomBookingId,
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

    if (details.location === "room" && staffBookingId && currentUser) {
      const doctorId = currentUser.id;
      setStaff((prev) =>
        prev.map((s) =>
          s.id === doctorId
            ? {
                ...s,
                bookings: [
                  ...s.bookings,
                  {
                    id: staffBookingId,
                    activityType: PATIENT_SESSION_ACTIVITY,
                    dateFrom: details.date,
                    dateTo: details.date,
                    startTime: details.startTime,
                    endTime: details.endTime,
                    note: patient.fullName,
                  },
                ],
              }
            : s,
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

    if (session?.roomId && session.roomBookingId) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === session.roomId
            ? { ...r, bookings: r.bookings.filter((b) => b.id !== session.roomBookingId) }
            : r,
        ),
      );
    }

    if (session?.staffBookingId) {
      setStaff((prev) =>
        prev.map((s) => ({
          ...s,
          bookings: s.bookings.filter((b) => b.id !== session.staffBookingId),
        })),
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

      const doctorId = staff.find((s) => s.fullName === appointment.doctorName)?.id;
      if (doctorId) {
        setStaff((prev) =>
          prev.map((s) =>
            s.id === doctorId
              ? {
                  ...s,
                  bookings: [
                    ...s.bookings,
                    {
                      id: `sb-${Date.now()}`,
                      activityType: PATIENT_APPOINTMENT_ACTIVITY,
                      dateFrom: appointment.date,
                      dateTo: appointment.date,
                      startTime,
                      endTime,
                      note: appointment.patientName,
                    },
                  ],
                }
              : s,
          ),
        );
      }
    }
  };

  const addDiaryEntry = (entry: DiaryEntry) => setDiaryEntries((prev) => [entry, ...prev]);

  const addStaffMember = (member: StaffMember) => setStaff((prev) => [...prev, member]);

  const updateStaffMember = (staffId: string, updates: Omit<StaffMember, "id" | "bookings">) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, ...updates } : s)));
  };

  const addStaffBooking = (staffId: string, booking: Omit<StaffBooking, "id">) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, bookings: [...s.bookings, { ...booking, id: `sb-${Date.now()}` }] }
          : s,
      ),
    );
  };

  const addActivityType = (activityType: EmployeeActivityType) =>
    setActivityTypes((prev) => [...prev, activityType]);

  const updateActivityType = (activityTypeId: string, title: string) => {
    setActivityTypes((prev) =>
      prev.map((a) => (a.id === activityTypeId ? { ...a, title } : a)),
    );
  };

  const removeActivityType = (activityTypeId: string) => {
    setActivityTypes((prev) => prev.filter((a) => a.id !== activityTypeId));
  };

  const addPosition = (position: Position) => setPositions((prev) => [...prev, position]);

  const updatePosition = (positionId: string, title: string) => {
    setPositions((prev) => prev.map((p) => (p.id === positionId ? { ...p, title } : p)));
  };

  const removePosition = (positionId: string) => {
    setPositions((prev) => prev.filter((p) => p.id !== positionId));
  };

  const addRoom = (room: Room) => setRooms((prev) => [...prev, room]);

  const updateRoom = (roomId: string, updates: Omit<Room, "id" | "bookings">) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, ...updates } : r)));
  };

  const removeRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const addRoomType = (roomType: RoomType) => setRoomTypes((prev) => [...prev, roomType]);

  const updateRoomType = (roomTypeId: string, title: string) => {
    setRoomTypes((prev) => prev.map((t) => (t.id === roomTypeId ? { ...t, title } : t)));
  };

  const removeRoomType = (roomTypeId: string) => {
    setRoomTypes((prev) => prev.filter((t) => t.id !== roomTypeId));
  };

  const addAppRole = (role: AppRole) => setAppRoles((prev) => [...prev, role]);

  const updateAppRole = (roleId: string, updates: Omit<AppRole, "id">) => {
    setAppRoles((prev) => prev.map((r) => (r.id === roleId ? { ...r, ...updates } : r)));
  };

  const removeAppRole = (roleId: string) => {
    setAppRoles((prev) => prev.filter((r) => r.id !== roleId));
  };

  const addWorkSection = (section: WorkSection) => setWorkSections((prev) => [...prev, section]);

  const updateWorkSection = (sectionId: string, title: string) => {
    setWorkSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, title } : s)));
  };

  const removeWorkSection = (sectionId: string) => {
    setWorkSections((prev) => prev.filter((s) => s.id !== sectionId));
    setExercises((prev) =>
      prev.map((e) => ({
        ...e,
        sectionIds: e.sectionIds.filter((id) => id !== sectionId),
      })),
    );
    setTrainerCatalog((prev) =>
      prev.map((t) => ({
        ...t,
        sectionIds: t.sectionIds.filter((id) => id !== sectionId),
      })),
    );
    setOfflineExercises((prev) =>
      prev.map((o) => ({
        ...o,
        sectionIds: o.sectionIds.filter((id) => id !== sectionId),
      })),
    );
  };

  const getExercise = (id: string) => exercises.find((e) => e.id === id);

  const addExerciseSection = (exerciseId: string, sectionId: string) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.id === exerciseId && !e.sectionIds.includes(sectionId)
          ? { ...e, sectionIds: [...e.sectionIds, sectionId] }
          : e,
      ),
    );
  };

  const removeExerciseSection = (exerciseId: string, sectionId: string) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.id === exerciseId
          ? { ...e, sectionIds: e.sectionIds.filter((id) => id !== sectionId) }
          : e,
      ),
    );
  };

  const addTrainerSection = (path: string, sectionId: string) => {
    setTrainerCatalog((prev) =>
      prev.map((t) =>
        t.path === path && !t.sectionIds.includes(sectionId)
          ? { ...t, sectionIds: [...t.sectionIds, sectionId] }
          : t,
      ),
    );
  };

  const removeTrainerSection = (path: string, sectionId: string) => {
    setTrainerCatalog((prev) =>
      prev.map((t) =>
        t.path === path
          ? { ...t, sectionIds: t.sectionIds.filter((id) => id !== sectionId) }
          : t,
      ),
    );
  };

  const addOfflineExerciseSection = (exerciseId: string, sectionId: string) => {
    setOfflineExercises((prev) =>
      prev.map((o) =>
        o.id === exerciseId && !o.sectionIds.includes(sectionId)
          ? { ...o, sectionIds: [...o.sectionIds, sectionId] }
          : o,
      ),
    );
  };

  const removeOfflineExerciseSection = (exerciseId: string, sectionId: string) => {
    setOfflineExercises((prev) =>
      prev.map((o) =>
        o.id === exerciseId
          ? { ...o, sectionIds: o.sectionIds.filter((id) => id !== sectionId) }
          : o,
      ),
    );
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
      addStaffBooking,
      activityTypes,
      addActivityType,
      updateActivityType,
      removeActivityType,
      positions,
      addPosition,
      updatePosition,
      removePosition,
      rooms,
      addRoom,
      updateRoom,
      removeRoom,
      roomTypes,
      addRoomType,
      updateRoomType,
      removeRoomType,
      appRoles,
      addAppRole,
      updateAppRole,
      removeAppRole,
      workSections,
      addWorkSection,
      updateWorkSection,
      removeWorkSection,
      exercises,
      getExercise,
      addExerciseSection,
      removeExerciseSection,
      trainerCatalog,
      addTrainerSection,
      removeTrainerSection,
      offlineExercises,
      addOfflineExerciseSection,
      removeOfflineExerciseSection,
      institution,
      updateInstitution,
    }),
    [
      currentUser,
      patients,
      appointments,
      diaryEntries,
      staff,
      activityTypes,
      positions,
      rooms,
      roomTypes,
      appRoles,
      workSections,
      exercises,
      trainerCatalog,
      offlineExercises,
      institution,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
