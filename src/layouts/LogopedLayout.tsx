import { LayoutDashboard, CalendarDays, Dumbbell, Users, UserCircle } from "lucide-react";
import { AppShell, type AppMenuItem } from "./AppShell";

const menuItems: AppMenuItem[] = [
  { to: "/logoped", label: "Рабочий стол", icon: LayoutDashboard, end: true },
  { to: "/logoped/schedule", label: "График приема", icon: CalendarDays },
  { to: "/logoped/exercise-bank", label: "Банк упражнений", icon: Dumbbell },
  { to: "/logoped/patients", label: "Мои пациенты", icon: Users },
  { to: "/logoped/profile", label: "Мой профиль", icon: UserCircle },
];

export default function LogopedLayout() {
  return <AppShell menuItems={menuItems} />;
}
