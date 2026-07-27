import { Link } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { getExerciseById } from "@/data/exercises";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, ClipboardList, ListChecks, Trophy } from "lucide-react";

export default function PatientDashboardPage() {
  const { currentUser, patients, appointments } = useAppState();
  const patient = patients.find((p) => p.id === currentUser?.patientId);

  if (!patient) return null;

  const myAppointments = appointments
    .filter((a) => a.patientId === patient.id)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const nextAppointment = myAppointments[0];
  const upcoming = myAppointments.slice(0, 3);
  const pendingExercises = patient.assignedExercises.filter((ae) => !ae.done);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Рабочий стол</h1>
        <p className="text-sm text-muted-foreground">Добро пожаловать, {patient.fullName}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-primary" />
              <CardTitle>График на ближайшие дни</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground">Ближайших занятий не запланировано</p>
            )}
            {upcoming.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/60"
              >
                <span className="text-sm text-foreground">{a.type}</span>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{a.date}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="size-4 text-primary" />
              <CardTitle>Следующий приём</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{nextAppointment.type}</p>
                  <p className="text-xs text-muted-foreground">Иванова А.С., логопед</p>
                </div>
                <Badge className="text-sm">
                  {nextAppointment.date} в {nextAppointment.time}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Приём не запланирован</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ListChecks className="size-4 text-primary" />
              <CardTitle>Моё домашнее задание</CardTitle>
            </div>
            <CardDescription>
              {pendingExercises.length > 0
                ? `Осталось выполнить: ${pendingExercises.length}`
                : "Все задания на сегодня выполнены"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {pendingExercises.slice(0, 3).map((ae) => {
              const ex = getExerciseById(ae.exerciseId);
              if (!ex) return null;
              return (
                <div key={ae.exerciseId} className="rounded-lg px-2 py-1.5 text-sm text-foreground">
                  {ex.title}
                </div>
              );
            })}
            <Button variant="link" className="mt-1 self-start px-2" render={<Link to="/patient/homework" />}>
              Перейти к заданиям →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-primary" />
              <CardTitle>Последнее достижение</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Trophy className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">5 занятий подряд без пропусков</p>
                <p className="text-xs text-muted-foreground">Продолжайте в том же духе!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
