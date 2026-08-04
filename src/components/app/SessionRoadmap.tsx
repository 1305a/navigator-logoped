import type { TherapySession } from "@/data/types";
import { getSessionProgress, getSessionStatus } from "@/lib/therapy";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { GradeStars } from "@/components/app/GradeStars";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronDown, ChevronUp, Lock, Plus, PlayCircle, Trash2 } from "lucide-react";

export function SessionRoadmap({
  sessions,
  onSelectSession,
  editable = false,
  onAddSession,
  onRemoveSession,
  onMoveSession,
}: {
  sessions: TherapySession[];
  onSelectSession: (session: TherapySession) => void;
  editable?: boolean;
  onAddSession?: () => void;
  onRemoveSession?: (sessionId: string) => void;
  onMoveSession?: (sessionId: string, direction: "up" | "down") => void;
}) {
  const { done, total, fraction } = getSessionProgress(sessions);

  if (total === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {editable
            ? "В программе пока нет занятий."
            : "Программа ещё не составлена — заполните речевую карту."}
        </p>
        {editable && (
          <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={onAddSession}>
            <Plus className="size-3.5" /> Добавить занятие
          </Button>
        )}
      </div>
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
        {sessions.map((session, index) => {
          const status = getSessionStatus(session, sessions);
          const locked = status === "locked";
          const completed = status === "completed";

          return (
            <div
              key={session.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors",
                locked ? "border-border bg-muted/30 opacity-60" : "border-border bg-card",
                status === "available" && "border-primary/50",
              )}
            >
              <button
                type="button"
                disabled={locked}
                onClick={() => onSelectSession(session)}
                className={cn(
                  "flex flex-1 items-center gap-3 text-left",
                  locked ? "cursor-not-allowed" : "cursor-pointer hover:opacity-80",
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
                    {completed && session.completedDate
                      ? ` · завершено ${session.completedDate}`
                      : ""}
                    {locked ? " · заблокировано" : ""}
                    {status === "available" ? " · доступно" : ""}
                  </p>
                </div>

                {completed && session.grade !== null && (
                  <GradeStars value={session.grade} size="sm" />
                )}
              </button>

              {editable && (
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={index === 0}
                    onClick={() => onMoveSession?.(session.id, "up")}
                  >
                    <ChevronUp className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={index === sessions.length - 1}
                    onClick={() => onMoveSession?.(session.id, "down")}
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => onRemoveSession?.(session.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editable && (
        <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={onAddSession}>
          <Plus className="size-3.5" /> Добавить занятие
        </Button>
      )}
    </div>
  );
}
