import type { TherapySession } from "@/data/types";
import { getSessionProgress, getSessionStatus } from "@/lib/therapy";
import { Progress } from "@/components/ui/progress";
import { GradeStars } from "@/components/app/GradeStars";
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

export function SessionRoadmap({
  sessions,
  onSelectSession,
}: {
  sessions: TherapySession[];
  onSelectSession: (session: TherapySession) => void;
}) {
  const { done, total, fraction } = getSessionProgress(sessions);

  if (total === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Программа ещё не составлена — заполните речевую карту.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Прогресс по программе</span>
          <span className="text-muted-foreground">
            {done} / {total} занятий
          </span>
        </div>
        <Progress value={fraction * 100} />
      </div>

      <div className="flex flex-col gap-2">
        {sessions.map((session) => {
          const status = getSessionStatus(session, sessions);
          const locked = status === "locked";
          const completed = status === "completed";

          return (
            <button
              key={session.id}
              type="button"
              disabled={locked}
              onClick={() => onSelectSession(session)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                locked
                  ? "cursor-not-allowed border-border bg-muted/30 opacity-60"
                  : "border-border bg-card hover:bg-muted/60",
                status === "available" && "border-primary/50",
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  completed && "bg-primary/10 text-primary",
                  status === "available" && "bg-accent text-primary",
                  locked && "bg-muted text-muted-foreground",
                )}
              >
                {completed && <CheckCircle2 className="size-4" />}
                {status === "available" && <PlayCircle className="size-4" />}
                {locked && <Lock className="size-4" />}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{session.title}</p>
                <p className="text-xs text-muted-foreground">
                  {session.exercises.length} упражнени
                  {session.exercises.length === 1 ? "е" : "я"}
                  {completed && session.completedDate ? ` · завершено ${session.completedDate}` : ""}
                  {locked ? " · заблокировано" : ""}
                  {status === "available" ? " · доступно" : ""}
                </p>
              </div>

              {completed && session.grade !== null && (
                <GradeStars value={session.grade} size="sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
