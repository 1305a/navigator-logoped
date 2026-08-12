import type { EmployeeActivityType } from "./types";

export const PATIENT_APPOINTMENT_ACTIVITY = "Приём пациента";
export const PATIENT_SESSION_ACTIVITY = "Занятие с пациентом";

export const initialEmployeeActivityTypes: EmployeeActivityType[] = [
  { id: "act1", title: PATIENT_APPOINTMENT_ACTIVITY },
  { id: "act2", title: PATIENT_SESSION_ACTIVITY },
  { id: "act3", title: "Отпуск" },
  { id: "act4", title: "Отгул" },
];
