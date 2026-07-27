import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import type { PatientInfo } from "@/data/types";
import { journalEntries, patientStatistics } from "@/data/misc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CalendarClock, ClipboardList, FileClock, User } from "lucide-react";

export default function NursePatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const { getPatient, appointments, updatePatientInfo } = useAppState();
  const patient = patientId ? getPatient(patientId) : undefined;
  const [info, setInfo] = useState<PatientInfo | undefined>(patient?.info);

  if (!patient || !info) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">Пациент не найден.</p>
        <Button variant="outline" className="mt-4" render={<Link to="/nurse/patients" />}>
          <ArrowLeft /> К списку пациентов
        </Button>
      </div>
    );
  }

  const myAppointments = appointments.filter((a) => a.patientId === patient.id);

  function handleSaveInfo() {
    if (!info || !patient) return;
    updatePatientInfo(patient.id, info);
    toast.success("Данные пациента сохранены");
  }

  function field(key: keyof PatientInfo, label: string) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-normal text-muted-foreground">{label}</Label>
        <Input
          value={info![key]}
          onChange={(e) => setInfo({ ...info!, [key]: e.target.value })}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-1 gap-1.5" render={<Link to="/nurse/patients" />}>
          <ArrowLeft className="size-4" /> Пациенты
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">{patient.fullName}</h1>
        <p className="text-sm text-muted-foreground">
          {patient.tariff} · Лечащий врач: {patient.info.attendingDoctor}
        </p>
      </div>

      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments" className="gap-1.5">
            <CalendarClock className="size-3.5" /> Назначения пациента
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="size-3.5" /> Профиль пациента
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-1.5">
            <ClipboardList className="size-3.5" /> Статистика
          </TabsTrigger>
          <TabsTrigger value="journal" className="gap-1.5">
            <FileClock className="size-3.5" /> Журнал
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Назначения пациента</CardTitle>
              <CardDescription>Лечащий врач и график посещений</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Лечащий врач</p>
                  <p className="text-sm font-medium text-foreground">{patient.info.attendingDoctor}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Тариф</p>
                  <p className="text-sm font-medium text-foreground">{patient.tariff}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Записи на приём</p>
                <div className="flex flex-col gap-1">
                  {myAppointments.length === 0 && (
                    <p className="text-sm text-muted-foreground">Записей нет</p>
                  )}
                  {myAppointments.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between rounded-lg border px-3 py-2"
                    >
                      <span className="text-sm text-foreground">{a.type}</span>
                      <Badge variant="secondary">
                        {a.date} в {a.time}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              {patient.programCreated && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-1 text-sm font-medium text-foreground">Программа коррекции</p>
                    <p className="text-sm text-muted-foreground">{patient.programSummary}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Профиль пациента</CardTitle>
              <CardDescription>Данные заполняются медсестрой при регистрации</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {field("birthDate", "Дата рождения")}
                {field("gender", "Пол")}
                {field("address", "Адрес")}
                {field("phone", "Телефон")}
                {field("contactPerson", "Контактное лицо")}
                {field("insurance", "Тип финансирования")}
                {field("referral", "Направление")}
                {field("admissionDate", "Дата начала лечения")}
                {field("attendingDoctor", "Лечащий врач")}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveInfo}>Сохранить</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
              <CardDescription>Активность пациента по занятиям</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatTile label="Всего визитов" value={String(patientStatistics.totalVisits)} />
                <StatTile
                  label="Выполнено упражнений"
                  value={String(patientStatistics.completedExercises)}
                />
                <StatTile label="Средняя оценка" value={patientStatistics.avgRating.toFixed(1)} />
              </div>
              <div>
                <p className="mb-3 text-sm font-medium text-foreground">Визиты по месяцам</p>
                <div className="flex items-end gap-4">
                  {patientStatistics.visitsByMonth.map((m) => (
                    <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-32 w-full items-end">
                        <div
                          className="w-full rounded-t-md bg-primary/70"
                          style={{ height: `${(m.visits / 13) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Журнал</CardTitle>
              <CardDescription>История действий по пациенту</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {journalEntries.map((j) => (
                <div key={j.id} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-muted/60">
                  <span className="mt-0.5 shrink-0 text-xs text-muted-foreground">{j.date}</span>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{j.actor}</span> — {j.action}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
