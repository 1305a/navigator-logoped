import { ChevronRight } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { branchesForAge, type IntakeAge } from "@/lib/intake";
import { cn } from "@/lib/utils";

export function IntakeComplaintStep({
  patientId,
  age,
  complaintId,
}: {
  patientId: string;
  age: IntakeAge;
  complaintId: string | null;
}) {
  const { selectIntakeComplaint } = useAppState();
  const branches = branchesForAge(age);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Главная жалоба</h3>
        <p className="text-sm text-muted-foreground">
          Выберите один вариант — он определит набор уточняющих вопросов и вариант речевой карты.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {branches.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => selectIntakeComplaint(patientId, b.id)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg border px-4 py-3.5 text-left text-sm transition-colors hover:border-primary/50 hover:bg-accent/40",
              complaintId === b.id && "border-primary bg-primary/5",
            )}
          >
            <span className="text-foreground">{b.label}</span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
