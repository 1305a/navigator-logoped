import { useParams } from "react-router-dom";
import SessionDetailPage from "@/pages/shared/SessionDetailPage";

export default function PatientSessionDetailRoute() {
  const { patientId } = useParams<{ patientId: string }>();
  if (!patientId) return null;
  return (
    <SessionDetailPage
      patientId={patientId}
      backTo={`/logoped/patients/${patientId}`}
      allowGrading
    />
  );
}
