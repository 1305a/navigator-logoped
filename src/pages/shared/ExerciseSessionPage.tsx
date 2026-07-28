import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { getExerciseById } from "@/data/exercises";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ExerciseReport } from "@/data/types";
import { ArrowLeft, CheckCircle2, Play, Square, Timer } from "lucide-react";

function generateReport(): ExerciseReport {
  const total = 10 + Math.floor(Math.random() * 6);
  const correct = Math.max(1, total - Math.floor(Math.random() * 4));
  const minutes = Math.floor(Math.random() * 4) + 3;
  const seconds = Math.floor(Math.random() * 60);
  return {
    correct,
    incorrect: total - correct,
    timeSpent: `${minutes} мин ${seconds.toString().padStart(2, "0")} сек`,
  };
}

export default function ExerciseSessionPage({
  backTo,
  patientId,
  sessionId,
}: {
  backTo: string;
  patientId: string;
  sessionId: string;
}) {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { setSessionExerciseDone } = useAppState();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [report, setReport] = useState<ExerciseReport | null>(null);

  const exercise = exerciseId ? getExerciseById(exerciseId) : undefined;

  if (!exercise) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-muted-foreground">Упражнение не найдено.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(backTo)}>
          <ArrowLeft /> Назад
        </Button>
      </div>
    );
  }

  function handleFinish() {
    setStarted(false);
    setReport(generateReport());
  }

  function handleCloseReport() {
    if (exerciseId) setSessionExerciseDone(patientId, sessionId, exerciseId, true);
    setReport(null);
    navigate(backTo);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => navigate(backTo)}>
        <ArrowLeft className="size-4" /> Назад к списку упражнений
      </Button>

      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            {exercise.category}
          </Badge>
          <CardTitle className="text-xl">{exercise.title}</CardTitle>
          <CardDescription>{exercise.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="size-4" />
            Продолжительность: {exercise.duration}
          </div>

          {!started && (
            <div className="rounded-lg border border-dashed bg-muted/40 p-8 text-center text-sm text-muted-foreground">
              Занятие ещё не начато. Нажмите «Начать занятие», чтобы перейти к выполнению
              упражнения.
            </div>
          )}

          {started && (
            <div className="flex flex-col items-center gap-3 rounded-lg border bg-accent/40 p-10 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Play className="size-6" />
              </div>
              <p className="text-sm font-medium text-foreground">Занятие выполняется…</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                В боевой версии сервиса здесь отображается интерактивное задание для пациента.
                В макете этот экран имитирует процесс выполнения.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {!started ? (
              <Button onClick={() => setStarted(true)} className="gap-1.5">
                <Play className="size-4" /> Начать занятие
              </Button>
            ) : (
              <Button onClick={handleFinish} variant="destructive" className="gap-1.5">
                <Square className="size-4" /> Закончить упражнение
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!report} onOpenChange={(open) => !open && handleCloseReport()}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-6" />
            </div>
            <DialogTitle className="text-center">Отчёт по упражнению</DialogTitle>
            <DialogDescription className="text-center">{exercise.title}</DialogDescription>
          </DialogHeader>
          {report && (
            <div className="grid grid-cols-3 gap-3 py-2">
              <div className="flex flex-col items-center rounded-lg border bg-card p-3">
                <span className="text-2xl font-semibold text-foreground">{report.correct}</span>
                <span className="text-xs text-muted-foreground">верных ответов</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-card p-3">
                <span className="text-2xl font-semibold text-foreground">{report.incorrect}</span>
                <span className="text-xs text-muted-foreground">неверных ответов</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-card p-3">
                <span className="text-lg font-semibold text-foreground">{report.timeSpent}</span>
                <span className="text-xs text-muted-foreground">время выполнения</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="w-full" onClick={handleCloseReport}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
