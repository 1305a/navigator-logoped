import type { DemoUser } from "./types";

export const demoUsers: DemoUser[] = [
  {
    id: "logoped-1",
    role: "logoped",
    fullName: "Иванова Анна Сергеевна",
    shortName: "Анна Сергеевна",
    avatarInitials: "АИ",
  },
  {
    id: "nurse-1",
    role: "nurse",
    fullName: "Петрова Ольга Николаевна",
    shortName: "Ольга Николаевна",
    avatarInitials: "ОП",
  },
  {
    id: "admin-1",
    role: "admin",
    fullName: "Смирнов Дмитрий Валерьевич",
    shortName: "Дмитрий Валерьевич",
    avatarInitials: "ДС",
  },
  {
    id: "patient-1",
    role: "patient",
    fullName: "Кузнецов Максим Игоревич",
    shortName: "Максим",
    avatarInitials: "МК",
    patientId: "p1",
  },
];

export const roleLabels: Record<string, string> = {
  nurse: "Медсестра",
  admin: "Администратор",
  logoped: "Логопед",
  patient: "Пациент",
};
