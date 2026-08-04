import { Navigate, Route, Routes } from "react-router-dom";
import { RequireRole } from "@/components/app/RequireRole";

import LoginPage from "@/pages/auth/LoginPage";

import LogopedLayout from "@/layouts/LogopedLayout";
import LogopedDashboardPage from "@/pages/logoped/DashboardPage";
import SchedulePage from "@/pages/logoped/SchedulePage";
import ExerciseBankPage from "@/pages/logoped/ExerciseBankPage";
import PatientsListPage from "@/pages/logoped/PatientsListPage";
import PatientDetailPage from "@/pages/logoped/PatientDetailPage";
import LogopedProfilePage from "@/pages/logoped/ProfilePage";
import LogopedExerciseSessionRoute from "@/pages/logoped/PatientExerciseSessionRoute";
import LogopedSessionDetailRoute from "@/pages/logoped/PatientSessionDetailRoute";
import LogopedAddPatientRoute from "@/pages/logoped/AddPatientRoute";

import PatientLayout from "@/layouts/PatientLayout";
import PatientDashboardPage from "@/pages/patient/PatientDashboardPage";
import HomeworkPage from "@/pages/patient/HomeworkPage";
import DiaryPage from "@/pages/patient/DiaryPage";
import ProgramPage from "@/pages/patient/ProgramPage";
import PatientExerciseSessionRoute from "@/pages/patient/PatientExerciseSessionRoute";
import PatientSessionDetailRoute from "@/pages/patient/PatientSessionDetailRoute";

import NurseLayout from "@/layouts/NurseLayout";
import NurseProfilePage from "@/pages/nurse/NurseProfilePage";
import NursePatientsListPage from "@/pages/nurse/NursePatientsListPage";
import NursePatientDetailPage from "@/pages/nurse/NursePatientDetailPage";
import NurseAddPatientRoute from "@/pages/nurse/AddPatientRoute";
import BookAppointmentPage from "@/pages/nurse/BookAppointmentPage";
import DocumentsPage from "@/pages/nurse/DocumentsPage";

import AdminLayout from "@/layouts/AdminLayout";
import GeneralPage from "@/pages/admin/GeneralPage";
import StaffPage from "@/pages/admin/StaffPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/logoped"
        element={
          <RequireRole role="logoped">
            <LogopedLayout />
          </RequireRole>
        }
      >
        <Route index element={<LogopedDashboardPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="exercise-bank" element={<ExerciseBankPage />} />
        <Route path="patients" element={<PatientsListPage />} />
        <Route path="patients/:patientId" element={<PatientDetailPage />} />
        <Route
          path="patients/:patientId/session/:sessionId"
          element={<LogopedSessionDetailRoute />}
        />
        <Route
          path="patients/:patientId/session/:sessionId/exercise/:exerciseId"
          element={<LogopedExerciseSessionRoute />}
        />
        <Route path="add-patient" element={<LogopedAddPatientRoute />} />
        <Route path="profile" element={<LogopedProfilePage />} />
      </Route>

      <Route
        path="/patient"
        element={
          <RequireRole role="patient">
            <PatientLayout />
          </RequireRole>
        }
      >
        <Route index element={<PatientDashboardPage />} />
        <Route path="homework" element={<HomeworkPage />} />
        <Route path="diary" element={<DiaryPage />} />
        <Route path="program" element={<ProgramPage />} />
        <Route path="program/session/:sessionId" element={<PatientSessionDetailRoute />} />
        <Route
          path="program/session/:sessionId/exercise/:exerciseId"
          element={<PatientExerciseSessionRoute />}
        />
      </Route>

      <Route
        path="/nurse"
        element={
          <RequireRole role="nurse">
            <NurseLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="/nurse/patients" replace />} />
        <Route path="profile" element={<NurseProfilePage />} />
        <Route path="patients" element={<NursePatientsListPage />} />
        <Route path="patients/:patientId" element={<NursePatientDetailPage />} />
        <Route path="add-patient" element={<NurseAddPatientRoute />} />
        <Route path="book-appointment" element={<BookAppointmentPage />} />
        <Route path="documents" element={<DocumentsPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireRole role="admin">
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="/admin/general" replace />} />
        <Route path="general" element={<GeneralPage />} />
        <Route path="staff" element={<StaffPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
