import { useAppState } from "@/context/AppStateContext";
import ExerciseSessionPage from "@/pages/shared/ExerciseSessionPage";

export default function PatientExerciseSessionRoute() {
  const { currentUser } = useAppState();
  const patientId = currentUser?.patientId;
  if (!patientId) return null;
  return <ExerciseSessionPage backTo="/patient/homework" patientId={patientId} />;
}
