import { useAppState } from "@/context/AppStateContext";
import { MDT_FIELDS, RISK_FIELDS } from "@/data/intake";
import type { IntakeState } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function IntakeAdditionalStep({
  patientId,
  intake,
}: {
  patientId: string;
  intake: IntakeState;
}) {
  const { updateIntakeRiskField, updateIntakeMdtField, setIntakeTab } = useAppState();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">Дополнительные параметры</h3>
        <p className="text-sm text-muted-foreground">
          Факторы риска и заключения смежных специалистов — необязательный шаг, можно вернуться и
          дополнить позже.
        </p>
      </div>

      <div className="rounded-lg border">
        <div className="border-b bg-muted/40 px-3.5 py-2.5 text-[13.5px] font-semibold text-foreground">
          Факторы риска
        </div>
        <div className="flex flex-col gap-4 px-3.5 py-3.5">
          {RISK_FIELDS.map((g) => (
            <div key={g.group} className="flex flex-col gap-3">
              <p className="text-[12.5px] font-semibold text-foreground/90">{g.group}</p>
              <div className="grid gap-3.5 sm:grid-cols-2">
                {g.fields.map((f) => (
                  <div key={f.key} className="flex flex-col gap-1.5">
                    <Label className="text-[11.5px] font-normal text-muted-foreground">{f.label}</Label>
                    <Textarea
                      value={intake.riskFactors[f.key] ?? ""}
                      onChange={(e) => updateIntakeRiskField(patientId, f.key, e.target.value)}
                      placeholder="Введите данные…"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="flex items-center justify-between border-b bg-muted/40 px-3.5 py-2.5">
          <span className="text-[13.5px] font-semibold text-foreground">
            Мультидисциплинарный подход
          </span>
          <Badge variant="secondary" className="text-[10.5px]">
            необязательно
          </Badge>
        </div>
        <div className="grid gap-3.5 px-3.5 py-3.5 sm:grid-cols-2">
          {MDT_FIELDS.map((f) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <Label className="text-[11.5px] font-normal text-muted-foreground">
                Заключение — {f.label}
              </Label>
              <Textarea
                value={intake.mdt[f.key] ?? ""}
                onChange={(e) => updateIntakeMdtField(patientId, f.key, e.target.value)}
                placeholder="Вставьте текст заключения или оставьте пустым — можно добавить позже"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-[12.5px] text-muted-foreground">Шаг не блокирует переход дальше</span>
        <Button onClick={() => setIntakeTab(patientId, "diagnosis")}>Перейти к диагнозу →</Button>
      </div>
    </div>
  );
}
