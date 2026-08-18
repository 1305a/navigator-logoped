import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import {
  ADULT_CARDS,
  CHILD_CARDS,
  DEVELOPED_CARDS,
  FULL_CARDS,
} from "@/data/intake";
import type { IntakeState } from "@/data/types";
import { answeredCount, findBranch, resolvedCard, type IntakeAge } from "@/lib/intake";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IntakeFullCard } from "./IntakeFullCard";

export function IntakeCardStep({
  patientId,
  age,
  intake,
}: {
  patientId: string;
  age: IntakeAge;
  intake: IntakeState;
}) {
  const { agreeIntakeRecommendation, manualSelectIntakeCard, changeIntakeCardSelection, setIntakeTab } =
    useAppState();
  const [manualPickerOpen, setManualPickerOpen] = useState(false);
  const branch = findBranch(age, intake.complaintId);
  const [done, total] = answeredCount(age, intake);

  if (!branch) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Сначала выберите главную жалобу и ответьте на уточняющие вопросы.
      </p>
    );
  }
  if (done < total) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Сначала ответьте на все уточняющие вопросы во вкладке «Уточняющие вопросы».
      </p>
    );
  }

  const recommended = resolvedCard(age, intake);
  const cardList = age === "child" ? CHILD_CARDS : ADULT_CARDS;

  if (!intake.selectedCard) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Речевая карта</h3>
          <p className="text-sm text-muted-foreground">
            Система предлагает вариант карты на основании жалобы и ответов — логопед подтверждает или
            выбирает другую.
          </p>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4.5 py-3.5">
          <p className="mb-1 text-[11.5px] font-medium uppercase tracking-wide text-primary">
            Рекомендованная речевая карта
          </p>
          <p className="text-base font-semibold text-foreground">{recommended}</p>
        </div>

        <div className="flex gap-2.5">
          <Button onClick={() => recommended && agreeIntakeRecommendation(patientId, recommended)}>
            Согласиться
          </Button>
          <Button variant="outline" onClick={() => setManualPickerOpen((v) => !v)}>
            Выбрать вручную
          </Button>
        </div>

        {manualPickerOpen && (
          <Select value="" onValueChange={(v) => v && manualSelectIntakeCard(patientId, v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="— выберите карту из списка —" />
            </SelectTrigger>
            <SelectContent>
              {cardList.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                  {!DEVELOPED_CARDS.includes(c) ? " (черновик)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex justify-end border-t pt-4">
          <Button disabled>Перейти к диагнозу →</Button>
        </div>
      </div>
    );
  }

  const chosen = intake.selectedCard;
  const overridden = chosen !== recommended;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Речевая карта</h3>
        <p className="text-sm text-muted-foreground">
          Система предлагает вариант карты на основании жалобы и ответов — логопед подтверждает или
          выбирает другую.
        </p>
      </div>

      <div className="flex items-start justify-between rounded-lg border border-primary/30 bg-primary/5 px-4.5 py-3.5">
        <div>
          <p className="mb-1 text-[11.5px] font-medium uppercase tracking-wide text-muted-foreground">
            Выбранная речевая карта
          </p>
          <p className="text-base font-semibold text-foreground">{chosen}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            changeIntakeCardSelection(patientId);
            setManualPickerOpen(false);
          }}
          className="whitespace-nowrap text-[12.5px] font-medium text-primary hover:underline"
        >
          Изменить
        </button>
      </div>

      {overridden && (
        <div className="flex items-start gap-2 rounded-md border-l-2 border-amber-500 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span>
            Отличается от рекомендации системы (была: «{recommended}») — фиксируется в отчёте для
            администратора
          </span>
        </div>
      )}

      {DEVELOPED_CARDS.includes(chosen) ? (
        <IntakeFullCard key={chosen} cardName={chosen} sections={FULL_CARDS[chosen]} />
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Карта «{chosen}» пока не разработана в развёрнутом виде.
          <br />
          Экспертам ЦПРиН предстоит создать полный протокол по аналогии с картами «Афазия» и «ОНР».
        </p>
      )}

      <div className="flex justify-end border-t pt-4">
        <Button onClick={() => setIntakeTab(patientId, "additional")}>Дополнительные параметры →</Button>
      </div>
    </div>
  );
}
