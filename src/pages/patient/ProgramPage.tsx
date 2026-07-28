import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SessionRoadmap } from "@/components/app/SessionRoadmap";

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
          <SessionRoadmap
            sessions={patient.sessions}
            onSelectSession={(s) => navigate(`/patient/program/session/${s.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
