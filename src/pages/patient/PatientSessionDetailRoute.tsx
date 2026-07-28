import { useAppState } from "@/context/AppStateContext";
import SessionDetailPage from "@/pages/shared/SessionDetailPage";

export default function PatientSessionDetailRoute() {
  const { currentUser } = useAppState();
  const patientId = currentUser?.patientId;
  if (!patientId) return null;
  return (
    <SessionDetailPage patientId={patientId} backTo="/patient/program" allowGrading={false} />
  );
}
