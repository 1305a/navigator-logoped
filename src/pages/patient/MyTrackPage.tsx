import { useAppState } from "@/context/AppStateContext";
import { Program2TrackTab } from "@/components/app/program2/Program2TrackTab";

export default function MyTrackPage() {
  const { currentUser } = useAppState();

  if (!currentUser?.patientId) return null;

  return <Program2TrackTab patientId={currentUser.patientId} editable={false} title="Мой трек" />;
}
