import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import { getExerciseById } from "@/data/exercises";
import { getSessionStatus } from "@/lib/therapy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GradeStars } from "@/components/app/GradeStars";
import { ArrowLeft, Lock, Play } from "lucide-react";

export default function SessionDetailPage({
  patientId,
  backTo,
  allowGrading,
}: {
  patientId: string;
  backTo: string;
  allowGrading: boolean;
}) {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { getPatient, setSessionExerciseDone, gradeSession } = useAppState();
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const patient = getPatient(patientId);
  const session = patient?.sessions.find((s) => s.id === sessionId);

  function goBack() {
    navigate(allowGrading ? `${backTo}?tab=program` : backTo);
  }

  if (!patient || !session) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-muted-foreground">Занятие не найдено.</p>
        <Button variant="outline" className="mt-4" onClick={goBack}>
          <ArrowLeft /> Назад
        </Button>
      </div>
    );
  }

  const status = getSessionStatus(session, patient.sessions);

  if (status === "locked") {
    return (
      <div className="mx-auto max-w-2xl">
        <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={goBack}>
          <ArrowLeft className="size-4" /> Назад к программе
        </Button>
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-12 text-center">
          <Lock className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Занятие пока недоступно</p>
          <p className="max-w-sm text-xs text-muted-foreground">
            Чтобы открыть «{session.title}», нужно сначала завершить предыдущее занятие.
          </p>
        </div>
      </div>
    );
  }

  const allDone = session.exercises.every((ex) => ex.done);
  const completed = status === "completed";

  function handleComplete() {
    if (!sessionId || !selectedGrade) return;
    gradeSession(patientId, sessionId, selectedGrade);
    toast.success("Занятие завершено");
    goBack();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={goBack}>
        <ArrowLeft className="size-4" /> Назад к программе
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{session.title}</CardTitle>
            <Badge variant={completed ? "secondary" : "outline"}>
              {completed ? "завершено" : "доступно"}
            </Badge>
          </div>
          <CardDescription>
            {session.exercises.length} упражнени
            {session.exercises.length === 1 ? "е" : "я"} в этом занятии
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {session.exercises.map((ex) => {
            const exercise = getExerciseById(ex.exerciseId);
            if (!exercise) return null;
            return (
              <div
                key={ex.exerciseId}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{exercise.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {exercise.category} · {exercise.duration}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={ex.done ? "secondary" : "outline"}>
                    {ex.done ? "выполнено" : "не выполнено"}
                  </Badge>
                  {!completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => {
                        if (sessionId) setSessionExerciseDone(patientId, sessionId, ex.exerciseId, false);
                        navigate(`${backTo}/session/${sessionId}/exercise/${ex.exerciseId}`);
                      }}
                    >
                      <Play className="size-3.5" /> Начать занятие
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          <Separator className="my-2" />

          {completed ? (
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Оценка занятия</p>
                {session.completedDate && (
                  <p className="text-xs text-muted-foreground">Завершено {session.completedDate}</p>
                )}
              </div>
              <GradeStars value={session.grade} />
            </div>
          ) : allowGrading ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border px-3 py-4">
              <p className="text-sm font-medium text-foreground">Оценка занятия</p>
              <GradeStars value={selectedGrade} onChange={setSelectedGrade} />
              {!allDone && (
                <p className="text-xs text-muted-foreground">
                  Выполните все упражнения, чтобы завершить занятие
                </p>
              )}
              <Button
                onClick={handleComplete}
                disabled={!allDone || !selectedGrade}
                className="w-full"
              >
                Завершить занятие
              </Button>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Занятие ещё не завершено логопедом.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
