import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { getExerciseById } from "@/data/exercises";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Play, Timer } from "lucide-react";

export default function HomeworkPage() {
  const { currentUser, patients } = useAppState();
  const navigate = useNavigate();
  const patient = patients.find((p) => p.id === currentUser?.patientId);

  if (!patient) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Домашнее задание</h1>
        <p className="text-sm text-muted-foreground">Упражнения, назначенные логопедом</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {patient.assignedExercises.map((ae) => {
          const ex = getExerciseById(ae.exerciseId);
          if (!ex) return null;
          return (
            <Card key={ae.exerciseId} className={ae.done ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary" className="w-fit">
                    {ex.category}
                  </Badge>
                  <Badge variant={ae.done ? "secondary" : "outline"} className="gap-1">
                    {ae.done && <CheckCircle2 className="size-3" />}
                    {ae.done ? "выполнено" : "не выполнено"}
                  </Badge>
                </div>
                <CardTitle className="text-base">{ex.title}</CardTitle>
                <CardDescription>{ex.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Timer className="size-3.5" /> {ex.duration}
                </span>
                <Button
                  size="sm"
                  disabled={ae.done}
                  className="gap-1.5"
                  onClick={() => navigate(`/patient/exercise/${ae.exerciseId}`)}
                >
                  <Play className="size-3.5" /> Начать занятие
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
