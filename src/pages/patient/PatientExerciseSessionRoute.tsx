import { useParams } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import ExerciseSessionPage from "@/pages/shared/ExerciseSessionPage";

export default function PatientExerciseSessionRoute() {
  const { currentUser } = useAppState();
  const { sessionId } = useParams<{ sessionId: string }>();
  const patientId = currentUser?.patientId;
  if (!patientId || !sessionId) return null;
  return (
    <ExerciseSessionPage
      backTo={`/patient/program/session/${sessionId}`}
      patientId={patientId}
      sessionId={sessionId}
    />
  );
}
