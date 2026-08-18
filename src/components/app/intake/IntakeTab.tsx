import { Check } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { answeredCount, deriveIntakeAge } from "@/lib/intake";
import type { IntakeTab as IntakeTabId } from "@/data/types";
import { IntakeMethodNote } from "./IntakeMethodNote";
import { IntakeComplaintStep } from "./IntakeComplaintStep";
import { IntakeQuestionsStep } from "./IntakeQuestionsStep";
import { IntakeCardStep } from "./IntakeCardStep";
import { IntakeAdditionalStep } from "./IntakeAdditionalStep";
import { IntakeDiagnosisStep } from "./IntakeDiagnosisStep";
import { IntakeGoalsStep } from "./IntakeGoalsStep";

const STEPS: { id: IntakeTabId; label: string; n: number }[] = [
  { id: "complaint", label: "Главная жалоба", n: 1 },
  { id: "questions", label: "Уточняющие вопросы", n: 2 },
  { id: "card", label: "Речевая карта", n: 3 },
  { id: "additional", label: "Доп. параметры", n: 4 },
  { id: "diagnosis", label: "Диагноз", n: 5 },
  { id: "goals", label: "Цели реабилитации", n: 6 },
];

export function IntakeTab({ patientId }: { patientId: string }) {
  const { getPatient, setIntakeTab } = useAppState();
  const patient = getPatient(patientId);
  if (!patient) return null;

  const age = deriveIntakeAge(patient.info.birthDate);
  const intake = patient.intake;
  const [done, total] = answeredCount(age, intake);

  function isDone(stepId: IntakeTabId): boolean {
    switch (stepId) {
      case "complaint":
        return !!intake.complaintId;
      case "questions":
        return done > 0 && done === total;
      case "card":
        return !!intake.selectedCard;
      case "additional":
        return intake.additionalVisited;
      case "diagnosis":
        return intake.diagApproved;
      case "goals":
        return intake.goalsSaved;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
        Черновой макет для обсуждения с экспертами ЦПРиН. Вопросы, форматы и правила подсказки карты —
        рабочая гипотеза, требует клинической валидации.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Блок приёма — от жалобы к речевой карте</span>
        <span>
          Возраст пациента: {age === "child" ? "ребёнок" : "взрослый"} (по дате рождения{" "}
          {patient.info.birthDate})
        </span>
      </div>

      <div className="flex flex-wrap gap-1 border-b">
        {STEPS.map((step) => {
          const active = intake.tab === step.id;
          const stepDone = isDone(step.id);
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setIntakeTab(patientId, step.id)}
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[13.5px] font-medium transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-[17px] shrink-0 items-center justify-center rounded-full text-[10.5px]",
                  stepDone
                    ? "bg-emerald-600 text-white"
                    : active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {stepDone ? <Check className="size-2.5" /> : step.n}
              </span>
              {step.label}
            </button>
          );
        })}
      </div>

      <Card className="relative">
        <CardContent className="pb-14 pt-6">
          {intake.tab === "complaint" && (
            <IntakeComplaintStep patientId={patientId} age={age} complaintId={intake.complaintId} />
          )}
          {intake.tab === "questions" && (
            <IntakeQuestionsStep patientId={patientId} age={age} intake={intake} />
          )}
          {intake.tab === "card" && <IntakeCardStep patientId={patientId} age={age} intake={intake} />}
          {intake.tab === "additional" && (
            <IntakeAdditionalStep patientId={patientId} intake={intake} />
          )}
          {intake.tab === "diagnosis" && (
            <IntakeDiagnosisStep patientId={patientId} age={age} intake={intake} />
          )}
          {intake.tab === "goals" && <IntakeGoalsStep patientId={patientId} intake={intake} />}
        </CardContent>
        <IntakeMethodNote age={age} intake={intake} />
      </Card>
    </div>
  );
}
