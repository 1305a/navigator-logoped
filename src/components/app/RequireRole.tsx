import { Navigate } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import type { Role } from "@/data/types";

export function RequireRole({ role, children }: { role: Role; children: React.ReactNode }) {
  const { currentUser } = useAppState();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.role !== role) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <>{children}</>;
}
