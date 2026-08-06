import type { StaffMember } from "./types";

export const initialStaff: StaffMember[] = [
  { id: "s1", fullName: "Петрова Ольга Николаевна", position: "Старшая медсестра", role: "nurse", active: true },
  { id: "s2", fullName: "Иванова Анна Сергеевна", position: "Логопед высшей категории", role: "logoped", active: true },
  { id: "s3", fullName: "Смирнов Дмитрий Валерьевич", position: "Главный администратор", role: "admin", active: true },
  { id: "s4", fullName: "Кузьмина Татьяна Игоревна", position: "Логопед", role: "logoped", active: true },
  { id: "s5", fullName: "Фёдоров Павел Николаевич", position: "Медицинский брат", role: "nurse", active: false },
];
