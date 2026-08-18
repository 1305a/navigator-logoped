import { useAppState } from "@/context/AppStateContext";
import { GAS_LEVELS, GOAL_SOURCES, ICF_CATEGORIES, ICF_LEVELS } from "@/data/intake";
import type { IntakeState } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function IntakeGoalsStep({ patientId, intake }: { patientId: string; intake: IntakeState }) {
  const {
    addIntakeGoal,
    removeIntakeGoal,
    updateIntakeGoal,
    setIntakeGoalOption,
    toggleIntakeGas,
    updateIntakeGas,
    pullIntakeGoalFromRequest,
    saveIntakeGoals,
  } = useAppState();

  if (!intake.diagApproved) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Сначала подтвердите диагноз во вкладке «Диагноз».
      </p>
    );
  }

  const psyRequest = intake.riskFactors.psyRequest;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Цели реабилитации</h3>
        <p className="text-sm text-muted-foreground">
          2–4 цели. Долгосрочную цель можно подтянуть из «Сформированного запроса» (Доп. параметры →
          Факторы риска).
        </p>
      </div>

      {intake.goals.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Целей пока нет — нажмите «Добавить цель».
        </p>
      )}

      <div className="flex flex-col gap-3.5">
        {intake.goals.map((g, i) => (
          <div key={g.id} className="rounded-lg border">
            <div className="flex items-center justify-between border-b bg-muted/40 px-3.5 py-2.5">
              <span className="text-[13.5px] font-semibold text-foreground">Цель {i + 1}</span>
              <button
                type="button"
                onClick={() => removeIntakeGoal(patientId, g.id)}
                className="text-[12.5px] font-medium text-primary hover:underline"
              >
                Удалить
              </button>
            </div>
            <div className="flex flex-col gap-4 px-3.5 py-3.5">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-foreground">Источник</p>
                <div className="flex flex-wrap gap-2">
                  {GOAL_SOURCES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setIntakeGoalOption(patientId, g.id, "source", s)}
                      className={cn(
                        "rounded-lg border px-3.5 py-1.5 text-sm transition-colors",
                        g.source === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input text-foreground hover:border-primary/50",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-foreground">Уровень по МКФ</p>
                <div className="flex flex-wrap gap-2">
                  {ICF_LEVELS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setIntakeGoalOption(patientId, g.id, "icfLevel", l)}
                      className={cn(
                        "rounded-lg border px-3.5 py-1.5 text-sm transition-colors",
                        g.icfLevel === l
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input text-foreground hover:border-primary/50",
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11.5px] font-normal text-muted-foreground">
                    Связанный код МКФ (необязательно)
                  </Label>
                  <Select
                    value={g.icfCode}
                    onValueChange={(v) => updateIntakeGoal(patientId, g.id, "icfCode", v ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—">
                        {(v: string | null) => {
                          const cat = ICF_CATEGORIES.find((c) => c.code === v);
                          return cat ? `${cat.code} — ${cat.label}` : "—";
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ICF_CATEGORIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code} — {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11.5px] font-normal text-muted-foreground">Срок оценки</Label>
                  <Textarea
                    value={g.deadline}
                    onChange={(e) => updateIntakeGoal(patientId, g.id, "deadline", e.target.value)}
                    placeholder="напр. к следующему контрольному сроку"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11.5px] font-normal text-muted-foreground">
                  Долгосрочная цель («чтобы…»)
                  {psyRequest && (
                    <>
                      {" — "}
                      <button
                        type="button"
                        onClick={() => pullIntakeGoalFromRequest(patientId, g.id)}
                        className="font-medium text-primary hover:underline"
                      >
                        подтянуть из запроса пациента
                      </button>
                    </>
                  )}
                </Label>
                <Textarea
                  value={g.longTerm}
                  onChange={(e) => updateIntakeGoal(patientId, g.id, "longTerm", e.target.value)}
                  placeholder="Чтобы..."
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11.5px] font-normal text-muted-foreground">
                  Конкретное измеримое действие
                </Label>
                <Textarea
                  value={g.action}
                  onChange={(e) => updateIntakeGoal(patientId, g.id, "action", e.target.value)}
                  placeholder="Пациент будет..."
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[11.5px] font-normal text-muted-foreground">
                  Критерий достижения
                </Label>
                <Textarea
                  value={g.criterion}
                  onChange={(e) => updateIntakeGoal(patientId, g.id, "criterion", e.target.value)}
                  placeholder="напр. 90% успешных попыток в структурированном диалоге"
                  rows={2}
                />
              </div>

              <button
                type="button"
                onClick={() => toggleIntakeGas(patientId, g.id)}
                className="self-start text-[12.5px] font-medium text-primary hover:underline"
              >
                {g.gasOpen ? "Свернуть" : "Развернуть"} по Goal Attainment Scale (5 уровней)
              </button>

              {g.gasOpen && (
                <div className="flex flex-col gap-3">
                  {GAS_LEVELS.map((l) => (
                    <div key={l.key} className="flex flex-col gap-1.5">
                      <Label className="text-[11.5px] font-normal text-muted-foreground">
                        {l.label}
                      </Label>
                      <Textarea
                        value={g.gas[l.key]}
                        onChange={(e) => updateIntakeGas(patientId, g.id, l.key, e.target.value)}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {intake.goals.length < 4 && (
        <Button variant="outline" onClick={() => addIntakeGoal(patientId)} className="w-fit gap-1.5">
          <Plus className="size-4" /> Добавить цель
        </Button>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-[12.5px] text-muted-foreground">
          {intake.goalsSaved ? "Далее — Программа (вне этого макета)" : ""}
        </span>
        <Button
          disabled={intake.goalsSaved || intake.goals.length === 0}
          onClick={() => saveIntakeGoals(patientId)}
        >
          {intake.goalsSaved ? "Сохранено" : "Сохранить цели"}
        </Button>
      </div>
    </div>
  );
}
