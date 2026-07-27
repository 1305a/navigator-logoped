import { useParams } from "react-router-dom";
import ExerciseSessionPage from "@/pages/shared/ExerciseSessionPage";

export default function PatientExerciseSessionRoute() {
  const { patientId } = useParams<{ patientId: string }>();
  if (!patientId) return null;
  return (
    <ExerciseSessionPage backTo={`/logoped/patients/${patientId}`} patientId={patientId} />
  );
}
