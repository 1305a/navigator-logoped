import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import type { PatientInfo, SpeechCard } from "@/data/types";
import { preliminaryQuestions } from "@/data/preliminaryQuestions";
import { speechCardTypes } from "@/data/speechCardTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SessionRoadmap } from "@/components/app/SessionRoadmap";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  ListChecks,
  Lock,
  ShieldAlert,
  Sparkles,
  User,
  XCircle,
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

const manualDisorderTypeOptions = [
  "Заикание (нарушение темпо-ритмической стороны речи)",
  "Нарушение звукопроизношения (дислалия)",
  "Дизартрия",
  "Задержка речевого развития",
  "Общее недоразвитие речи (ОНР)",
  "Системное нарушение связности речи",
  "Афазия",
];

function determineDisorderType(answers: Record<string, boolean | string>): string {
  if (answers.stuttering === true || answers.repetition === true) {
    return "Заикание (нарушение темпо-ритмической стороны речи)";
  }
  if (answers.soundErrors === true) {
    return "Нарушение звукопроизношения (дислалия/дизартрия)";
  }
  if (answers.comprehension === "Затруднено") {
    return "Системное недоразвитие речи с преимущественным нарушением понимания";
  }
  if (answers.speechDelay === true) {
    return "Задержка речевого развития";
  }
  return "Систематическое нарушение связанности речи";
}

const manualDiagnosisOptions = [
  "Дислалия",
  "Стёртая дизартрия",
  "Заикание невротической формы",
  "Задержка речевого развития (ЗРР)",
  "Общее недоразвитие речи (ОНР) III уровня",
  "Моторная афазия лёгкой степени",
  "Сенсомоторная афазия средней степени",
];

const defaultExercisePool = [
  "ex-1",
  "ex-2",
  "ex-3",
  "ex-4",
  "ex-5",
  "ex-6",
  "ex-7",
  "ex-8",
  "ex-9",
  "ex-10",
];

export default function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const {
    getPatient,
    saveSpeechCard,
    suggestDisorderType,
    approveDisorderType,
    rejectDisorderType,
    suggestDiagnosis,
    approveDiagnosis,
    rejectDiagnosis,
    createProgram,
    updatePatientInfo,
  } = useAppState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") ?? "info");
  const patient = patientId ? getPatient(patientId) : undefined;
  const [form, setForm] = useState<SpeechCard>(patient?.speechCard ?? emptyCard);
  const [manualDiagnosis, setManualDiagnosis] = useState("");
  const [info, setInfo] = useState<PatientInfo | undefined>(patient?.info);
  const [preliminaryAnswers, setPreliminaryAnswers] = useState<Record<string, boolean | string>>(
    {},
  );
  const [selectedCardTypeId, setSelectedCardTypeId] = useState("");
  const [cardTypeAnswers, setCardTypeAnswers] = useState<Record<string, boolean | string>>({});

  if (!patient || !info) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">Пациент не найден.</p>
        <Button variant="outline" className="mt-4" render={<Link to="/logoped/patients" />}>
          <ArrowLeft /> К списку пациентов
        </Button>
      </div>
    );
  }

  function handleGetDiagnosisFromCard() {
    if (!patient || !selectedCardTypeId) return;
    const cardType = speechCardTypes.find((t) => t.id === selectedCardTypeId);
    if (!cardType) return;
    const details = cardType.questions
      .map((q) => {
        const v = cardTypeAnswers[q.id];
        if (v === undefined || v === "") return null;
        return typeof v === "boolean" ? (v ? q.text : null) : `${q.text} — ${v}.`;
      })
      .filter((s): s is string => !!s);
    const diagnosisText = `На основании речевой карты «${cardType.label}» и подтверждённого типа расстройства (${
      patient.suggestedDisorderType ?? "не указан"
    }) предполагается диагноз: ${patient.suggestedDisorderType ?? "уточняется"}.${
      details.length ? " " + details.join(" ") : ""
    }`;
    suggestDiagnosis(patient.id, diagnosisText);
    toast.success("Диагноз предложен системой");
    setTab("diagnosis");
  }

  function handleApproveDiagnosis() {
    if (!patient) return;
    approveDiagnosis(patient.id);
    const summary = `Индивидуальная программа коррекции составлена на основании диагноза: ${
      patient.suggestedDiagnosis ?? patient.suggestedDisorderType ?? "уточняется"
    } Периодичность — 2–3 раза в неделю по 25–30 минут. Основные направления: работа над звукопроизношением и фонематическим слухом, развитие лексико-грамматического строя речи, автоматизация поставленных навыков в самостоятельной речи.`;
    createProgram(patient.id, summary, defaultExercisePool, 6);
    toast.success("Диагноз одобрен, программа составлена");
    setTab("program");
  }

  function handleSaveRiskFactors() {
    if (!patient) return;
    saveSpeechCard(patient.id, form);
    toast.success("Факторы риска сохранены");
  }

  function handleDetermineDisorderType() {
    if (!patient) return;
    suggestDisorderType(patient.id, determineDisorderType(preliminaryAnswers));
    toast.success("Тип расстройства определён системой");
  }

  function handleApproveDisorderType() {
    if (!patient) return;
    approveDisorderType(patient.id);
    toast.success("Тип расстройства подтверждён");
  }

  function handleRejectDisorderType() {
    if (!patient) return;
    rejectDisorderType(patient.id);
    toast.error("Тип расстройства отклонён");
  }

  function handleManualDisorderType(value: string) {
    if (!patient) return;
    suggestDisorderType(patient.id, value);
    approveDisorderType(patient.id);
    toast.success("Тип расстройства выбран вручную");
  }

  function handleSaveInfo() {
    if (!patient || !info) return;
    updatePatientInfo(patient.id, info);
    toast.success("Данные пациента сохранены");
  }

  function infoField(key: keyof PatientInfo, label: string) {
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

  function handleRejectDiagnosis() {
    if (!patient) return;
    rejectDiagnosis(patient.id);
    toast.error("Диагноз отклонён");
  }

  function handleManualDiagnosis() {
    if (!patient || !manualDiagnosis) return;
    suggestDiagnosis(patient.id, manualDiagnosis);
    approveDiagnosis(patient.id);
    const summary = `Индивидуальная программа коррекции составлена на основании диагноза, выбранного логопедом вручную: ${manualDiagnosis}. Периодичность — 2–3 раза в неделю по 25–30 минут. Основные направления: работа над звукопроизношением и фонематическим слухом, развитие лексико-грамматического строя речи, автоматизация поставленных навыков в самостоятельной речи.`;
    createProgram(patient.id, summary, defaultExercisePool, 6);
    toast.success("Программа составлена на основе выбранного диагноза");
    setTab("program");
  }

  const selectedCardType = speechCardTypes.find((t) => t.id === selectedCardTypeId);
  const cardLocked = patient.disorderTypeStatus !== "approved";
  const diagnosisLocked = !patient.suggestedDiagnosis;
  const programLocked = !patient.programCreated;

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
          <TabsTrigger value="preliminary" className="gap-1.5">
            <ListChecks className="size-3.5" /> Предварительный набор вопросов
          </TabsTrigger>
          <TabsTrigger value="card" disabled={cardLocked} className="gap-1.5">
            {cardLocked && <Lock className="size-3.5" />} Речевая карта
          </TabsTrigger>
          <TabsTrigger value="diagnosis" disabled={diagnosisLocked} className="gap-1.5">
            {diagnosisLocked && <Lock className="size-3.5" />} Диагноз
          </TabsTrigger>
          <TabsTrigger value="riskFactors" className="gap-1.5">
            <ShieldAlert className="size-3.5" /> Факторы риска
          </TabsTrigger>
          <TabsTrigger value="program" disabled={programLocked} className="gap-1.5">
            {programLocked && <Lock className="size-3.5" />} Программа
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Информация о пациенте</CardTitle>
              <CardDescription>
                Данные пациента — при необходимости отредактируйте и сохраните
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {infoField("birthDate", "Дата рождения")}
                {infoField("gender", "Пол")}
                {infoField("address", "Адрес")}
                {infoField("phone", "Телефон")}
                {infoField("contactPerson", "Контактное лицо")}
                {infoField("insurance", "Тип финансирования")}
                {infoField("referral", "Направление")}
                {infoField("admissionDate", "Дата начала лечения")}
                {infoField("attendingDoctor", "Лечащий врач")}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveInfo}>Сохранить</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preliminary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Предварительный набор вопросов</CardTitle>
              <CardDescription>
                Экспресс-опрос для предварительной оценки типа речевого расстройства
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                {preliminaryQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5"
                  >
                    <Label className="text-sm font-normal text-foreground">{q.text}</Label>
                    {q.type === "checkbox" ? (
                      <Checkbox
                        checked={preliminaryAnswers[q.id] === true}
                        onCheckedChange={(checked) =>
                          setPreliminaryAnswers({
                            ...preliminaryAnswers,
                            [q.id]: checked === true,
                          })
                        }
                      />
                    ) : (
                      <Select
                        value={(preliminaryAnswers[q.id] as string) ?? ""}
                        onValueChange={(v) =>
                          v && setPreliminaryAnswers({ ...preliminaryAnswers, [q.id]: v })
                        }
                      >
                        <SelectTrigger className="w-44">
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                        <SelectContent>
                          {q.options?.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {!patient.suggestedDisorderType && (
                <div className="flex justify-end">
                  <Button onClick={handleDetermineDisorderType} className="gap-1.5">
                    <Sparkles className="size-4" /> Определить тип расстройства
                  </Button>
                </div>
              )}

              {patient.suggestedDisorderType && patient.disorderTypeStatus === "pending" && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="mb-1 text-xs text-muted-foreground">
                      Предполагаемый тип расстройства
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {patient.suggestedDisorderType}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleRejectDisorderType} className="gap-1.5">
                      <XCircle className="size-4" /> Отказаться
                    </Button>
                    <Button onClick={handleApproveDisorderType} className="gap-1.5">
                      <CheckCircle2 className="size-4" /> Согласиться
                    </Button>
                  </div>
                </div>
              )}

              {patient.disorderTypeStatus === "approved" && patient.suggestedDisorderType && (
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Тип расстройства</p>
                    <p className="text-sm font-medium text-foreground">
                      {patient.suggestedDisorderType}
                    </p>
                  </div>
                  <Badge variant="secondary">Подтверждён</Badge>
                </div>
              )}

              {patient.disorderTypeStatus === "rejected" && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">Тип расстройства отклонён.</p>
                  <div className="flex flex-col gap-1.5">
                    <Label>Выбрать тип расстройства вручную</Label>
                    <Select value="" onValueChange={(v) => v && handleManualDisorderType(v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите тип расстройства" />
                      </SelectTrigger>
                      <SelectContent>
                        {manualDisorderTypeOptions.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="card" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Речевая карта</CardTitle>
              <CardDescription>
                {patient.suggestedDiagnosis
                  ? "Диагноз уже сформирован на основании речевой карты."
                  : "Выберите тип речевой карты и ответьте на вопросы, чтобы получить диагноз"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="mb-1 text-xs text-muted-foreground">Подтверждённый тип расстройства</p>
                <p className="text-sm font-medium text-foreground">
                  {patient.suggestedDisorderType}
                </p>
              </div>

              {!patient.suggestedDiagnosis && (
                <>
                  <Separator />
                  <div className="flex flex-col gap-1.5">
                    <Label>Тип речевой карты</Label>
                    <Select
                      value={selectedCardTypeId}
                      onValueChange={(v) => v && setSelectedCardTypeId(v)}
                    >
                      <SelectTrigger className="w-full sm:w-80">
                        <SelectValue placeholder="Выберите тип речевой карты">
                          {(value: string | null) =>
                            value
                              ? speechCardTypes.find((t) => t.id === value)?.label
                              : "Выберите тип речевой карты"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {speechCardTypes.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCardType && (
                    <div className="flex flex-col gap-2">
                      {selectedCardType.questions.map((q) => (
                        <div
                          key={q.id}
                          className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5"
                        >
                          <Label className="text-sm font-normal text-foreground">{q.text}</Label>
                          {q.type === "checkbox" ? (
                            <Checkbox
                              checked={cardTypeAnswers[q.id] === true}
                              onCheckedChange={(checked) =>
                                setCardTypeAnswers({
                                  ...cardTypeAnswers,
                                  [q.id]: checked === true,
                                })
                              }
                            />
                          ) : (
                            <Select
                              value={(cardTypeAnswers[q.id] as string) ?? ""}
                              onValueChange={(v) =>
                                v && setCardTypeAnswers({ ...cardTypeAnswers, [q.id]: v })
                              }
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Выберите" />
                              </SelectTrigger>
                              <SelectContent>
                                {q.options?.map((o) => (
                                  <SelectItem key={o} value={o}>
                                    {o}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      onClick={handleGetDiagnosisFromCard}
                      disabled={!selectedCardTypeId}
                      className="gap-1.5"
                    >
                      <Sparkles className="size-4" /> Получить диагноз
                    </Button>
                  </div>
                </>
              )}

              {patient.suggestedDiagnosis && (
                <div className="flex items-center gap-1.5 self-end text-sm text-primary">
                  <ClipboardCheck className="size-4" />
                  {patient.diagnosisStatus === "approved"
                    ? "Диагноз одобрен, программа составлена"
                    : patient.diagnosisStatus === "rejected"
                      ? "Диагноз отклонён"
                      : "Карта отправлена на анализ — перейдите во вкладку «Диагноз»"}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnosis" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Диагноз</CardTitle>
              <CardDescription>Предположение системы на основе речевой карты</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div>
                <Badge
                  variant={
                    patient.diagnosisStatus === "approved"
                      ? "secondary"
                      : patient.diagnosisStatus === "rejected"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {patient.diagnosisStatus === "approved"
                    ? "Одобрен"
                    : patient.diagnosisStatus === "rejected"
                      ? "Отклонён"
                      : "Ожидает решения"}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {patient.suggestedDiagnosis ?? "Диагноз ещё не сформирован."}
              </p>
              <Separator />

              {patient.diagnosisStatus === "pending" && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleRejectDiagnosis} className="gap-1.5">
                    <XCircle className="size-4" /> Отклонить
                  </Button>
                  <Button onClick={handleApproveDiagnosis} className="gap-1.5">
                    <CheckCircle2 className="size-4" /> Одобрить
                  </Button>
                </div>
              )}
              {patient.diagnosisStatus === "approved" && (
                <div className="flex items-center gap-1.5 self-end text-sm text-primary">
                  <ClipboardCheck className="size-4" /> Диагноз одобрен, программа составлена
                </div>
              )}
              {patient.diagnosisStatus === "rejected" && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">
                    Диагноз отклонён. Требуется очное обследование для уточнения.
                  </p>
                  <Separator />
                  <div className="flex flex-col gap-1.5">
                    <Label>Выбрать диагноз вручную</Label>
                    <Select
                      value={manualDiagnosis}
                      onValueChange={(v) => v && setManualDiagnosis(v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите диагноз" />
                      </SelectTrigger>
                      <SelectContent>
                        {manualDiagnosisOptions.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleManualDiagnosis}
                      disabled={!manualDiagnosis}
                      className="gap-1.5"
                    >
                      <Sparkles className="size-4" /> Составить программу
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="riskFactors" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Факторы риска</CardTitle>
              <CardDescription>
                Биологические, психологические и социальные факторы — при необходимости
                отредактируйте и сохраните
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <SpeechCardSection title="1. Биологические">
                <CardField
                  label="Заболевание (медицинский диагноз), лежащий в основе РР"
                  value={form.diagnosis}
                  onChange={(v) => setForm({ ...form, diagnosis: v })}
                />
                <CardField
                  label="Длительность заболевания (речевого расстройства)"
                  value={form.durationOfDisorder}
                  onChange={(v) => setForm({ ...form, durationOfDisorder: v })}
                />
                <CardField
                  label="Высокая утомляемость (толерантность к психической нагрузке)"
                  value={form.fatigueLevel}
                  onChange={(v) => setForm({ ...form, fatigueLevel: v })}
                />
              </SpeechCardSection>

              <Separator />

              <SpeechCardSection title="2. Психологический портрет">
                <CardField
                  label="Когнитивный статус"
                  value={form.cognitiveStatus}
                  onChange={(v) => setForm({ ...form, cognitiveStatus: v })}
                />
                <CardField
                  label="Мотивация (факт-чекинг прошлой истории)"
                  value={form.motivation}
                  onChange={(v) => setForm({ ...form, motivation: v })}
                />
                <CardField
                  label="Адекватные ожидания"
                  value={form.expectations}
                  onChange={(v) => setForm({ ...form, expectations: v })}
                />
                <CardField
                  label="Сформированный запрос (влияние на жизненные потребности)"
                  value={form.formedRequest}
                  onChange={(v) => setForm({ ...form, formedRequest: v })}
                />
              </SpeechCardSection>

              <Separator />

              <SpeechCardSection title="3. Социальные">
                <CardField
                  label="Поддержка ближайшего окружения"
                  value={form.familySupport}
                  onChange={(v) => setForm({ ...form, familySupport: v })}
                />
                <CardField
                  label="Увлечения (справочник типичных интересов)"
                  value={form.hobbies}
                  onChange={(v) => setForm({ ...form, hobbies: v })}
                />
              </SpeechCardSection>

              <div className="flex justify-end">
                <Button onClick={handleSaveRiskFactors}>Сохранить</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Программа</CardTitle>
              <CardDescription>Карта терапии — последовательность занятий</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <p className="text-sm leading-relaxed text-foreground">{patient.programSummary}</p>
              <Separator />
              <SessionRoadmap
                sessions={patient.sessions}
                onSelectSession={(s) => navigate(`/logoped/patients/${patient.id}/session/${s.id}`)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-normal text-muted-foreground">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Введите данные…"
        rows={2}
      />
    </div>
  );
}
