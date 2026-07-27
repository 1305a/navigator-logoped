import { Link } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarClock, ChevronRight, Users } from "lucide-react";

const NEXT_THREE_DAYS = ["27.07.2026", "28.07.2026", "29.07.2026"];

export default function DashboardPage() {
  const { patients, appointments } = useAppState();

  const upcoming = appointments
    .filter((a) => NEXT_THREE_DAYS.includes(a.date))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Рабочий стол</h1>
        <p className="text-sm text-muted-foreground">Иванова Анна Сергеевна · Логопед</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <CardTitle>Назначенные пациенты</CardTitle>
            </div>
            <CardDescription>Пациенты, закреплённые за вами</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {patients.map((p) => (
              <Link
                key={p.id}
                to={`/logoped/patients/${p.id}`}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                    {p.fullName
                      .split(" ")
                      .slice(0, 2)
                      .map((s) => s[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{p.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.notes}</p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-primary" />
              <CardTitle>График приёма на ближайшие три дня</CardTitle>
            </div>
            <CardDescription>27–29 июля 2026</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {upcoming.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted/60"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{a.patientName}</span>
                  <span className="text-xs text-muted-foreground">{a.type}</span>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="secondary">{a.time}</Badge>
                  <span className="mt-1 text-xs text-muted-foreground">{a.date}</span>
                </div>
              </div>
            ))}
            <Button
              variant="link"
              className="mt-2 self-start px-2"
              render={<Link to="/logoped/schedule" />}
            >
              Открыть полный график →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
