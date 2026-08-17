import { LayoutDashboard, ListChecks, BookHeart, ClipboardList, Route } from "lucide-react";
import { AppShell, type AppMenuItem } from "./AppShell";

const menuItems: AppMenuItem[] = [
  { to: "/patient", label: "Рабочий стол", icon: LayoutDashboard, end: true },
  { to: "/patient/homework", label: "Домашнее задание", icon: ListChecks },
  { to: "/patient/diary", label: "Мой дневник", icon: BookHeart },
  { to: "/patient/program", label: "Моя программа", icon: ClipboardList },
  { to: "/patient/my-track", label: "Мой трек", icon: Route },
];

export default function PatientLayout() {
  return <AppShell menuItems={menuItems} />;
}
