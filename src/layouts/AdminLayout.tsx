import { Briefcase, Building2, CalendarClock, DoorOpen, Users } from "lucide-react";
import { AppShell, type AppMenuItem } from "./AppShell";

const menuItems: AppMenuItem[] = [
  { to: "/admin/institution", label: "Учреждение", icon: Building2 },
  { to: "/admin/staff", label: "Список сотрудников", icon: Users },
  { to: "/admin/positions", label: "Должности", icon: Briefcase },
  { to: "/admin/rooms", label: "Кабинеты", icon: DoorOpen },
  { to: "/admin/activity-types", label: "Тип занятости сотрудника", icon: CalendarClock },
];

export default function AdminLayout() {
  return <AppShell menuItems={menuItems} />;
}
