import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { getExerciseById } from "@/data/exercises";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProgramPage() {
  const { currentUser, patients } = useAppState();
  const navigate = useNavigate();
  const patient = patients.find((p) => p.id === currentUser?.patientId);

  if (!patient) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Моя программа</h1>
        <p className="text-sm text-muted-foreground">Индивидуальная программа логопедической коррекции</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Программа занятий</CardTitle>
          <CardDescription>Составлена логопедом Ивановой А.С.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <p className="text-sm leading-relaxed text-foreground">{patient.programSummary}</p>
          <Separator />
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Упражнения по программе</p>
            <div className="flex flex-col gap-1">
              {patient.assignedExercises.map((ae) => {
                const ex = getExerciseById(ae.exerciseId);
                if (!ex) return null;
                return (
                  <button
                    key={ae.exerciseId}
                    onClick={() => navigate("/patient/homework")}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{ex.title}</p>
                      <p className="text-xs text-muted-foreground">{ex.category}</p>
                    </div>
                    <Badge variant={ae.done ? "secondary" : "outline"}>
                      {ae.done ? "выполнено" : "не выполнено"}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
