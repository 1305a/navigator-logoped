import { Briefcase, Building2, Users } from "lucide-react";
import { AppShell, type AppMenuItem } from "./AppShell";

const menuItems: AppMenuItem[] = [
  { to: "/admin/general", label: "Общие", icon: Building2 },
  { to: "/admin/staff", label: "Список сотрудников", icon: Users },
  { to: "/admin/positions", label: "Должности", icon: Briefcase },
];

export default function AdminLayout() {
  return <AppShell menuItems={menuItems} />;
}
