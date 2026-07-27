import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DoctorAvatar } from "@/components/app/DoctorAvatar";
import { CalendarDays, CalendarPlus, GraduationCap, Mail, Phone, UserPlus } from "lucide-react";

const infoRows = [
  { icon: CalendarDays, label: "Дата рождения", value: "3 сентября 1990 г." },
  { icon: GraduationCap, label: "Образование", value: "Московский медицинский колледж №1, 2011 г." },
  { icon: Phone, label: "Телефон", value: "+7 (495) 234-56-78" },
  { icon: Mail, label: "Email", value: "o.petrova@navigator-logoped.ru" },
];

export default function NurseProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Профиль медсестры</h1>
          <p className="text-sm text-muted-foreground">Личные данные сотрудника</p>
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
            <DoctorAvatar className="size-32 rounded-full border" />
            <div>
              <p className="text-lg font-semibold text-foreground">Петрова Ольга Николаевна</p>
              <p className="text-sm text-muted-foreground">Старшая медсестра</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Общая информация</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {infoRows.map((row) => (
              <div key={row.label} className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                  <row.icon className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="text-sm font-medium text-foreground">{row.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
