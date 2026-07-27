import { UserCircle, Users, UserPlus, CalendarPlus, FileText } from "lucide-react";
import { AppShell, type AppMenuItem } from "./AppShell";

const menuItems: AppMenuItem[] = [
  { to: "/nurse/patients", label: "Пациенты", icon: Users },
  { to: "/nurse/add-patient", label: "Добавить пациента", icon: UserPlus },
  { to: "/nurse/book-appointment", label: "Запись на прием", icon: CalendarPlus },
  { to: "/nurse/documents", label: "Документы", icon: FileText },
  { to: "/nurse/profile", label: "Мой профиль", icon: UserCircle },
];

export default function NurseLayout() {
  return <AppShell menuItems={menuItems} />;
}
