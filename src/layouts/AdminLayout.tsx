import { Briefcase, Building2, DoorOpen, Users } from "lucide-react";
import { AppShell, type AppMenuItem } from "./AppShell";

const menuItems: AppMenuItem[] = [
  { to: "/admin/institution", label: "Учреждение", icon: Building2 },
  { to: "/admin/staff", label: "Список сотрудников", icon: Users },
  { to: "/admin/positions", label: "Должности", icon: Briefcase },
  { to: "/admin/rooms", label: "Кабинеты", icon: DoorOpen },
];

export default function AdminLayout() {
  return <AppShell menuItems={menuItems} />;
}
