import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import { getExerciseById } from "@/data/exercises";
import type { SpeechCard } from "@/data/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ClipboardCheck,
  FileText,
  Lock,
  Play,
  Sparkles,
  User,
} from "lucide-react";

const emptyCard: SpeechCard = {
  diagnosis: "",
  durationOfDisorder: "",
  fatigueLevel: "",
  cognitiveStatus: "",
  motivation: "",
  expectations: "",
  formedRequest: "",
  familySupport: "",
  hobbies: "",
};

const defaultExerciseSet = ["ex-1", "ex-4", "ex-5", "ex-10"];

export default function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const { getPatient, saveSpeechCard, createProgram, setExerciseDone } = useAppState();
  const navigate = useNavigate();
  const [tab, setTab] = useState("info");
  const patient = patientId ? getPatient(patientId) : undefined;
  const [form, setForm] = useState<SpeechCard>(patient?.speechCard ?? emptyCard);

  if (!patient) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">Пациент не найден.</p>
        <Button variant="outline" className="mt-4" render={<Link to="/logoped/patients" />}>
          <ArrowLeft /> К списку пациентов
        </Button>
      </div>
    );
  }

  function handleSaveCard() {
    if (!patient) return;
    saveSpeechCard(patient.id, form);
    const summary = `Индивидуальная программа коррекции составлена на основании данных речевой карты. Диагноз: ${
      form.diagnosis || "уточняется"
    }. Периодичность — 2–3 раза в неделю по 25–30 минут. Основные направления: работа над звукопроизношением и фонематическим слухом, развитие лексико-грамматического строя речи, автоматизация поставленных навыков в самостоятельной речи.`;
    createProgram(patient.id, summary, defaultExerciseSet);
    toast.success("Программа успешно составлена");
    setTab("program");
  }

  const locked = !patient.programCreated;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-1 gap-1.5"
            render={<Link to="/logoped/patients" />}
          >
            <ArrowLeft className="size-4" /> Мои пациенты
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">{patient.fullName}</h1>
          <p className="text-sm text-muted-foreground">
            {patient.tariff} · Последняя активность {patient.lastActivity}
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="info" className="gap-1.5">
            <User className="size-3.5" /> Информация о пациенте
          </TabsTrigger>
          <TabsTrigger value="card" className="gap-1.5">
            <FileText className="size-3.5" /> Речевая карта
          </TabsTrigger>
          <TabsTrigger value="program" disabled={locked} className="gap-1.5">
            {locked && <Lock className="size-3.5" />} Программа
          </TabsTrigger>
          <TabsTrigger value="exercises" disabled={locked} className="gap-1.5">
            {locked && <Lock className="size-3.5" />} Список упражнений
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Информация о пациенте</CardTitle>
              <CardDescription>Данные, заполненные медсестрой при регистрации</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Дата рождения" value={patient.info.birthDate} />
              <InfoRow label="Пол" value={patient.info.gender} />
              <InfoRow label="Адрес" value={patient.info.address} />
              <InfoRow label="Телефон" value={patient.info.phone} />
              <InfoRow label="Контактное лицо" value={patient.info.contactPerson} />
              <InfoRow label="Тип финансирования" value={patient.info.insurance} />
              <InfoRow label="Направление" value={patient.info.referral} />
              <InfoRow label="Дата начала лечения" value={patient.info.admissionDate} />
              <InfoRow label="Лечащий врач" value={patient.info.attendingDoctor} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="card" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Речевая карта</CardTitle>
              <CardDescription>
                {patient.speechCard
                  ? "Опросник заполнен. Данные использованы при составлении программы."
                  : "Заполните опросник, чтобы составить индивидуальную программу"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <SpeechCardSection title="1. Биологические">
                <CardField
                  label="Заболевание (медицинский диагноз), лежащий в основе РР"
                  value={form.diagnosis}
                  onChange={(v) => setForm({ ...form, diagnosis: v })}
                  readOnly={!!patient.speechCard}
                />
                <CardField
                  label="Длительность заболевания (речевого расстройства)"
                  value={form.durationOfDisorder}
                  onChange={(v) => setForm({ ...form, durationOfDisorder: v })}
                  readOnly={!!patient.speechCard}
                />
                <CardField
                  label="Высокая утомляемость (толерантность к психической нагрузке)"
                  value={form.fatigueLevel}
                  onChange={(v) => setForm({ ...form, fatigueLevel: v })}
                  readOnly={!!patient.speechCard}
                />
              </SpeechCardSection>

              <Separator />

              <SpeechCardSection title="2. Психологический портрет">
                <CardField
                  label="Когнитивный статус"
                  value={form.cognitiveStatus}
                  onChange={(v) => setForm({ ...form, cognitiveStatus: v })}
                  readOnly={!!patient.speechCard}
                />
                <CardField
                  label="Мотивация (факт-чекинг прошлой истории)"
                  value={form.motivation}
                  onChange={(v) => setForm({ ...form, motivation: v })}
                  readOnly={!!patient.speechCard}
                />
                <CardField
                  label="Адекватные ожидания"
                  value={form.expectations}
                  onChange={(v) => setForm({ ...form, expectations: v })}
                  readOnly={!!patient.speechCard}
                />
                <CardField
                  label="Сформированный запрос (влияние на жизненные потребности)"
                  value={form.formedRequest}
                  onChange={(v) => setForm({ ...form, formedRequest: v })}
                  readOnly={!!patient.speechCard}
                />
              </SpeechCardSection>

              <Separator />

              <SpeechCardSection title="3. Социальные">
                <CardField
                  label="Поддержка ближайшего окружения"
                  value={form.familySupport}
                  onChange={(v) => setForm({ ...form, familySupport: v })}
                  readOnly={!!patient.speechCard}
                />
                <CardField
                  label="Увлечения (справочник типичных интересов)"
                  value={form.hobbies}
                  onChange={(v) => setForm({ ...form, hobbies: v })}
                  readOnly={!!patient.speechCard}
                />
              </SpeechCardSection>

              {!patient.speechCard && (
                <div className="flex justify-end">
                  <Button onClick={handleSaveCard} className="gap-1.5">
                    <Sparkles className="size-4" /> Составить программу
                  </Button>
                </div>
              )}
              {patient.speechCard && patient.programCreated && (
                <div className="flex items-center gap-1.5 self-end text-sm text-primary">
                  <ClipboardCheck className="size-4" /> Программа уже составлена
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Программа</CardTitle>
              <CardDescription>Индивидуальная программа логопедической коррекции</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <p className="text-sm leading-relaxed text-foreground">{patient.programSummary}</p>
              <Separator />
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Упражнения, которые необходимо выполнить
                </p>
                <div className="flex flex-col gap-1">
                  {patient.assignedExercises.map((ae) => {
                    const ex = getExerciseById(ae.exerciseId);
                    if (!ex) return null;
                    return (
                      <button
                        key={ae.exerciseId}
                        onClick={() => setTab("exercises")}
                        className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{ex.title}</p>
                          <p className="text-xs text-muted-foreground">{ex.category}</p>
                        </div>
                        <Badge variant={ae.done ? "secondary" : "outline"}>
                          {ae.done ? "выполнено" : "не выполнено"}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Список упражнений</CardTitle>
              <CardDescription>Назначенные упражнения по текущей программе</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {patient.assignedExercises.map((ae) => {
                const ex = getExerciseById(ae.exerciseId);
                if (!ex) return null;
                return (
                  <div
                    key={ae.exerciseId}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{ex.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {ex.category} · {ex.duration}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={ae.done ? "secondary" : "outline"}>
                        {ae.done ? "выполнено" : "не выполнено"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => {
                          setExerciseDone(patient.id, ae.exerciseId, false);
                          navigate(`/logoped/patients/${patient.id}/exercise/${ae.exerciseId}`);
                        }}
                      >
                        <Play className="size-3.5" /> Начать занятие
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function SpeechCardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function CardField({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-normal text-muted-foreground">{label}</Label>
      {readOnly ? (
        <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground">
          {value || "—"}
        </p>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Введите данные…"
          rows={2}
        />
      )}
    </div>
  );
}
