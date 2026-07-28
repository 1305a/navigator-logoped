import { useParams } from "react-router-dom";
import ExerciseSessionPage from "@/pages/shared/ExerciseSessionPage";

export default function PatientExerciseSessionRoute() {
  const { patientId, sessionId } = useParams<{ patientId: string; sessionId: string }>();
  if (!patientId || !sessionId) return null;
  return (
    <ExerciseSessionPage
      backTo={`/logoped/patients/${patientId}/session/${sessionId}`}
      patientId={patientId}
      sessionId={sessionId}
    />
  );
}
