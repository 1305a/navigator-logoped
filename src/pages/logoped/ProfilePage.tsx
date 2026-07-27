import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DoctorAvatar } from "@/components/app/DoctorAvatar";
import { Award, BookOpen, CalendarDays, GraduationCap, Mail, Phone } from "lucide-react";

const infoRows = [
  { icon: CalendarDays, label: "Дата рождения", value: "12 апреля 1988 г." },
  { icon: GraduationCap, label: "Образование", value: "МПГУ, дефектологический факультет, 2010 г." },
  { icon: Award, label: "Категория", value: "Высшая квалификационная категория" },
  { icon: BookOpen, label: "Опыт работы", value: "14 лет" },
  { icon: Phone, label: "Телефон", value: "+7 (495) 123-45-67" },
  { icon: Mail, label: "Email", value: "a.ivanova@navigator-logoped.ru" },
];

const specializations = [
  "Афазия и постинсультная реабилитация",
  "Задержка речевого развития",
  "Заикание",
  "Дизартрия",
  "ОНР",
];

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Мой профиль</h1>
        <p className="text-sm text-muted-foreground">Личные данные и квалификация</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
            <DoctorAvatar className="size-32 rounded-full border" />
            <div>
              <p className="text-lg font-semibold text-foreground">Иванова Анна Сергеевна</p>
              <p className="text-sm text-muted-foreground">Логопед</p>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {specializations.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Общая информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
            <Separator className="my-5" />
            <p className="text-sm text-muted-foreground">
              Работает с детьми и взрослыми пациентами, специализируется на восстановлении речи
              после неврологических нарушений и коррекции речевых расстройств у детей дошкольного
              и младшего школьного возраста.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
