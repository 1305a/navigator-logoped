import { useAppState } from "@/context/AppStateContext";
import { answeredCount, findBranch, visibleQuestions, type IntakeAge } from "@/lib/intake";
import type { IntakeState } from "@/data/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function IntakeQuestionsStep({
  patientId,
  age,
  intake,
}: {
  patientId: string;
  age: IntakeAge;
  intake: IntakeState;
}) {
  const { setIntakeAnswer, setIntakeTab } = useAppState();
  const branch = findBranch(age, intake.complaintId);

  if (!branch) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Сначала выберите главную жалобу на предыдущей вкладке.
      </p>
    );
  }

  const visible = visibleQuestions(branch, intake);
  const [done, total] = answeredCount(age, intake);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Уточняющие вопросы</h3>
        <p className="text-sm text-muted-foreground">Ветка: «{branch.label}»</p>
      </div>

      <div className="flex flex-col divide-y">
        {visible.map((q) => {
          const val = intake.answers[q.id];
          return (
            <div key={q.id} className="py-4 first:pt-0">
              <p className="mb-0.5 text-sm font-medium text-foreground">{q.text}</p>
              <p className="mb-2.5 text-[11.5px] text-muted-foreground">Источник: {q.source}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((o) => {
                  const on = q.type === "multi" ? Array.isArray(val) && val.includes(o) : val === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setIntakeAnswer(patientId, q.id, o, q.type === "multi")}
                      className={cn(
                        "rounded-lg border px-3.5 py-1.5 text-sm text-foreground transition-colors",
                        on
                          ? q.type === "multi"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:border-primary/50",
                      )}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-[12.5px] text-muted-foreground">
          Отвечено {done} из {total}
        </span>
        <Button disabled={done < total} onClick={() => setIntakeTab(patientId, "card")}>
          Сформировать речевую карту →
        </Button>
      </div>
    </div>
  );
}
