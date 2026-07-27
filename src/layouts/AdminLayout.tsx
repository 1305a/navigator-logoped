import { Building2, Users } from "lucide-react";
import { AppShell, type AppMenuItem } from "./AppShell";

const menuItems: AppMenuItem[] = [
  { to: "/admin/general", label: "Общие", icon: Building2 },
  { to: "/admin/staff", label: "Список сотрудников", icon: Users },
];

export default function AdminLayout() {
  return <AppShell menuItems={menuItems} />;
}
