import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { parseRuDate, daysBetween } from "@/lib/date";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarPlus, UserPlus } from "lucide-react";

const TODAY = parseRuDate("27.07.2026");

const filters = [
  "Все пациенты",
  "Новые за 10 дней",
  "Приобретен курс",
  "Не были 120 дней",
  "Приема не было",
] as const;

export default function NursePatientsListPage() {
  const { patients } = useAppState();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Все пациенты");

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case "Новые за 10 дней":
        return patients.filter(
          (p) => daysBetween(TODAY, parseRuDate(p.info.admissionDate)) <= 10,
        );
      case "Приобретен курс":
        return patients.filter((p) => p.tariff === "Премиум");
      case "Не были 120 дней":
        return patients.filter(
          (p) => daysBetween(TODAY, parseRuDate(p.lastActivity)) >= 120,
        );
      case "Приема не было":
        return patients.filter((p) => p.lastActivity === p.info.admissionDate);
      default:
        return patients;
    }
  }, [patients, activeFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Пациенты</h1>
          <p className="text-sm text-muted-foreground">Список пациентов учреждения</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-1.5"
            render={<Link to="/nurse/book-appointment" />}
          >
            <CalendarPlus className="size-4" /> Запись на приём
          </Button>
          <Button className="gap-1.5" render={<Link to="/nurse/add-patient" />}>
            <UserPlus className="size-4" /> Добавить пациента
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              activeFilter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">№</TableHead>
              <TableHead>ФИО</TableHead>
              <TableHead>Дата рождения</TableHead>
              <TableHead>Лечащий врач</TableHead>
              <TableHead>Тариф</TableHead>
              <TableHead>Дата начала лечения</TableHead>
              <TableHead>Дата последнего приёма</TableHead>
              <TableHead className="text-right">Подробности</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                  Пациенты не найдены по выбранному фильтру
                </TableCell>
              </TableRow>
            )}
            {filtered.map((p, idx) => (
              <TableRow key={p.id}>
                <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                <TableCell className="font-medium text-foreground">{p.fullName}</TableCell>
                <TableCell className="text-muted-foreground">{p.info.birthDate}</TableCell>
                <TableCell className="text-muted-foreground">{p.info.attendingDoctor}</TableCell>
                <TableCell>
                  <Badge variant="outline">{p.tariff}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.info.admissionDate}</TableCell>
                <TableCell className="text-muted-foreground">{p.lastActivity}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" render={<Link to={`/nurse/patients/${p.id}`} />}>
                    Подробности
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
