import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CalendarCheck2, CheckCircle2 } from "lucide-react";

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
];

function formatRuDate(date: Date) {
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatRuDateLong(date: Date) {
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", weekday: "long" });
}

export default function BookAppointmentPage() {
  const { patients, staff, appointments, addAppointment } = useAppState();

  const doctors = staff.filter((s) => s.role === "logoped");

  const [patientId, setPatientId] = useState<string>(patients[0]?.id ?? "");
  const [doctorName, setDoctorName] = useState<string>(doctors[0]?.fullName ?? "");
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 6, 27));
  const [time, setTime] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const patient = patients.find((p) => p.id === patientId);
  const dateStr = date ? formatRuDate(date) : "";

  const slots = useMemo(() => {
    if (!date) return [];
    return TIME_SLOTS.map((slot) => {
      const occupied = appointments.find(
        (a) => a.date === dateStr && a.time === slot && a.doctorName === doctorName,
      );
      return { time: slot, occupied };
    });
  }, [appointments, dateStr, doctorName, date]);

  function handleSave() {
    if (!patient || !doctorName || !date || !time) {
      toast.error("Заполните пациента, врача, дату и время приёма");
      return;
    }
    const isFirstVisit = patient.info.admissionDate === dateStr;
    addAppointment({
      id: `a-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.fullName,
      date: dateStr,
      time,
      type: isFirstVisit ? "Первичный приём" : "Индивидуальное занятие",
      doctorName,
    });
    setSaved(true);
  }

  if (saved && patient && date && time) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-7" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Запись оформлена</h1>
        <Card className="w-full text-left">
          <CardContent className="flex flex-col gap-3 pt-6">
            <Row label="Пациент" value={patient.fullName} />
            <Row label="Врач" value={doctorName} />
            <Row label="Дата" value={formatRuDateLong(date)} />
            <Row label="Время" value={time} />
          </CardContent>
        </Card>
        <Button className="w-full" render={<Link to="/nurse/patients" />}>
          Вернуться в список пациентов
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-1 gap-1.5"
          render={<Link to="/nurse/patients" />}
        >
          <ArrowLeft className="size-4" /> Пациенты
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Запись на приём</h1>
        <p className="text-sm text-muted-foreground">Выберите пациента, врача, дату и свободное время</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Пациент и врач</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Пациент</Label>
            <Select value={patientId} onValueChange={(v) => v && setPatientId(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите пациента">
                  {(value: string | null) =>
                    value ? patients.find((p) => p.id === value)?.fullName : "Выберите пациента"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Врач</Label>
            <Select value={doctorName} onValueChange={(v) => v && setDoctorName(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={d.fullName}>
                    {d.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Дата приёма</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setTime(null);
              }}
              defaultMonth={date}
              className="rounded-lg border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Свободное время</CardTitle>
            <CardDescription>{date ? formatRuDateLong(date) : "Выберите дату"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!!slot.occupied}
                  onClick={() => setTime(slot.time)}
                  className={`flex flex-col items-start rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    time === slot.time
                      ? "border-primary bg-primary text-primary-foreground"
                      : slot.occupied
                        ? "border-border bg-muted/50"
                        : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  <span className="font-medium">{slot.time}</span>
                  <span className={time === slot.time ? "text-primary-foreground/80" : "text-muted-foreground"}>
                    {slot.occupied ? slot.occupied.patientName.split(" ")[0] : "свободно"}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-1.5" disabled={!time}>
          <CalendarCheck2 className="size-4" /> Сохранить запись пациента
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant="secondary">{value}</Badge>
    </div>
  );
}
