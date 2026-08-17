export type Role = "nurse" | "admin" | "logoped" | "patient";

export interface DemoUser {
  id: string;
  role: Role;
  fullName: string;
  shortName: string;
  avatarInitials: string;
  /** For role "patient": id of the corresponding record in the patients dataset. */
  patientId?: string;
}

export interface SpeechCard {
  diagnosis: string;
  durationOfDisorder: string;
  fatigueLevel: string;
  cognitiveStatus: string;
  motivation: string;
  expectations: string;
  formedRequest: string;
  familySupport: string;
  hobbies: string;
}

export interface WorkSection {
  id: string;
  title: string;
}

export interface Exercise {
  id: string;
  title: string;
  sectionIds: string[];
  description: string;
  duration: string;
}

export interface TrainerCatalogEntry {
  path: string;
  title: string;
  description: string;
  count: number;
  duration: string;
  sectionIds: string[];
}

export interface OfflineExercise {
  id: string;
  title: string;
  format: string;
  description: string;
  sectionIds: string[];
}

export interface SessionExercise {
  exerciseId: string;
  done: boolean;
}

export interface TherapySession {
  id: string;
  order: number;
  title: string;
  exercises: SessionExercise[];
  grade: number | null;
  completedDate: string | null;
  location: "home" | "room" | null;
  roomId: string | null;
  scheduledDate: string | null;
  startTime: string | null;
  endTime: string | null;
  roomBookingId: string | null;
  staffBookingId: string | null;
}

export interface RoomBooking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  doctorName: string;
  patientName: string;
  sessionTitle: string;
}

export interface Room {
  id: string;
  name: string;
  roomType: string;
  bookings: RoomBooking[];
}

export interface RoomType {
  id: string;
  title: string;
}

export interface ExerciseReport {
  correct: number;
  incorrect: number;
  timeSpent: string;
}

export interface PatientInfo {
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
  contactPerson: string;
  insurance: string;
  referral: string;
  admissionDate: string;
  attendingDoctor: string;
}

export type DiagnosisStatus = "pending" | "approved" | "rejected";

export interface Program2Exercise {
  id: string;
  exerciseId: string;
  done: boolean;
  autoGraded: boolean;
  ratings: { accuracy: number | null; independence: number | null; pace: number | null };
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  roomId: string | null;
}

export interface Program2Section {
  id: string;
  sectionId: string;
  exercises: Program2Exercise[];
}

export interface Program2Session {
  id: string;
  location: "home" | "room" | null;
  roomId: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  sections: Program2Section[];
}

export interface Patient {
  id: string;
  fullName: string;
  tariff: string;
  notes: string;
  lastActivity: string;
  avgRating: number;
  info: PatientInfo;
  speechCard: SpeechCard | null;
  suggestedDisorderType: string | null;
  disorderTypeStatus: DiagnosisStatus;
  suggestedDiagnosis: string | null;
  diagnosisStatus: DiagnosisStatus;
  programCreated: boolean;
  programSummary: string;
  sessions: TherapySession[];
  program2AutoBuilt: boolean;
  program2Auto: Program2Session[];
  program2Work: Program2Session[];
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  type: string;
  doctorName?: string;
  roomId: string | null;
  roomStartTime: string | null;
  roomEndTime: string | null;
}

export interface DiaryEntry {
  id: string;
  date: string;
  wellbeing: string;
  mood: string;
  weather: string;
  text: string;
}

export interface StaffBooking {
  id: string;
  activityType: string;
  dateFrom: string;
  dateTo: string;
  startTime: string | null;
  endTime: string | null;
  note: string;
}

export interface StaffMember {
  id: string;
  fullName: string;
  position: string;
  role: Role;
  active: boolean;
  bookings: StaffBooking[];
}

export interface Position {
  id: string;
  title: string;
}

export interface EmployeeActivityType {
  id: string;
  title: string;
}

export interface RolePermission {
  blockId: string;
  read: boolean;
  edit: boolean;
}

export interface AppRole {
  id: string;
  title: string;
  interfaceKey: Role | "";
  permissions: RolePermission[];
}
