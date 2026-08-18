import { useAppState } from "@/context/AppStateContext";
import { ICF_CATEGORIES, ICF_QUALIFIERS } from "@/data/intake";
import type { IntakeState } from "@/data/types";
import { answeredCount, diagnosisText, findBranch, type IntakeAge } from "@/lib/intake";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function IntakeDiagnosisStep({
  patientId,
  age,
  intake,
}: {
  patientId: string;
  age: IntakeAge;
  intake: IntakeState;
}) {
  const { setIntakeIcf, approveIntakeDiagnosis, setIntakeTab } = useAppState();
  const branch = findBranch(age, intake.complaintId);
  const [done, total] = answeredCount(age, intake);

  if (!branch) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Сначала пройдите жалобу, вопросы и речевую карту.
      </p>
    );
  }
  if (done < total) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Диагноз формируется после ответа на все уточняющие вопросы.
      </p>
    );
  }
  if (!intake.selectedCard) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Сначала подтвердите или выберите речевую карту во вкладке «Речевая карта».
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">Диагноз</h3>
        <p className="text-sm text-muted-foreground">
          Функциональный профиль и категориальный диагноз — логопед может отредактировать перед
          сохранением.
        </p>
      </div>

      <div className="rounded-lg border">
        <div className="flex items-center justify-between border-b bg-muted/40 px-3.5 py-2.5">
          <span className="text-[13.5px] font-semibold text-foreground">
            Функциональный профиль (МКФ)
          </span>
          <Badge variant="secondary" className="text-[10.5px]">
            пример категорий
          </Badge>
        </div>
        <div className="flex flex-col divide-y px-3.5">
          {ICF_CATEGORIES.map((c) => (
            <div key={c.code} className="py-3.5 first:pt-3.5">
              <p className="mb-2 text-sm font-medium text-foreground">
                {c.code} — {c.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {ICF_QUALIFIERS.map((q, i) => (
                  <button
                    key={q}
                    type="button"
                    title={`${i} — ${q}`}
                    onClick={() => setIntakeIcf(patientId, c.code, i)}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg border text-sm text-foreground transition-colors",
                      intake.icf[c.code] === i
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:border-primary/50",
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="pb-3.5 pt-1 text-xs text-muted-foreground">
            Шкала МКФ 0–4 (официальная, отличается от внутренней 0–3). Полный набор категорий под
            каждую карту подберут эксперты — например, из ICF Core Set for Stroke.
          </p>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="flex items-center justify-between border-b bg-muted/40 px-3.5 py-2.5">
          <span className="text-[13.5px] font-semibold text-foreground">
            Категориальный диагноз (МКБ)
          </span>
          <Badge variant={intake.diagApproved ? "secondary" : "outline"}>
            {intake.diagApproved ? "Подтверждён" : "Черновик"}
          </Badge>
        </div>
        <div className="px-3.5 py-3.5">
          <div className="rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed text-foreground">
            {diagnosisText(age, intake)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-[12.5px] text-muted-foreground">
          {intake.diagApproved ? "Диагноз подтверждён" : ""}
        </span>
        {intake.diagApproved ? (
          <Button onClick={() => setIntakeTab(patientId, "goals")}>Цели реабилитации →</Button>
        ) : (
          <Button onClick={() => approveIntakeDiagnosis(patientId)}>Подтвердить диагноз</Button>
        )}
      </div>
    </div>
  );
}
