import { Navigate, Route, Routes } from "react-router-dom";
import { RequireRole } from "@/components/app/RequireRole";

import LoginPage from "@/pages/auth/LoginPage";

import LogopedLayout from "@/layouts/LogopedLayout";
import LogopedDashboardPage from "@/pages/logoped/DashboardPage";
import SchedulePage from "@/pages/logoped/SchedulePage";
import ExerciseBankPage from "@/pages/logoped/ExerciseBankPage";
import WordPartsTrainerPage from "@/pages/logoped/WordPartsTrainerPage";
import LetterFixTrainerPage from "@/pages/logoped/LetterFixTrainerPage";
import WordEndingsTrainerPage from "@/pages/logoped/WordEndingsTrainerPage";
import PhraseBuilderTrainerPage from "@/pages/logoped/PhraseBuilderTrainerPage";
import PhraseImageMatchTrainerPage from "@/pages/logoped/PhraseImageMatchTrainerPage";
import AdjectiveNounTrainerPage from "@/pages/logoped/AdjectiveNounTrainerPage";
import VerbToImageTrainerPage from "@/pages/logoped/VerbToImageTrainerPage";
import SyllableInsertTrainerPage from "@/pages/logoped/SyllableInsertTrainerPage";
import VerbPrefixTrainerPage from "@/pages/logoped/VerbPrefixTrainerPage";
import VerbWordsTrainerPage from "@/pages/logoped/VerbWordsTrainerPage";
import WordFeaturesTrainerPage from "@/pages/logoped/WordFeaturesTrainerPage";
import VerbPhrasesTrainerPage from "@/pages/logoped/VerbPhrasesTrainerPage";
import AnagramsTrainerPage from "@/pages/logoped/AnagramsTrainerPage";
import PhraseAssemblyTrainerPage from "@/pages/logoped/PhraseAssemblyTrainerPage";
import CommonNounTrainerPage from "@/pages/logoped/CommonNounTrainerPage";
import CommonAdjectiveTrainerPage from "@/pages/logoped/CommonAdjectiveTrainerPage";
import ParonymsTrainerPage from "@/pages/logoped/ParonymsTrainerPage";
import ComposePhraseTrainerPage from "@/pages/logoped/ComposePhraseTrainerPage";
import MissingLettersTrainerPage from "@/pages/logoped/MissingLettersTrainerPage";
import PrepositionsTrainerPage from "@/pages/logoped/PrepositionsTrainerPage";
import LetterSearchTrainerPage from "@/pages/logoped/LetterSearchTrainerPage";
import ShowWhereTrainerPage from "@/pages/logoped/ShowWhereTrainerPage";
import ShowSceneTrainerPage from "@/pages/logoped/ShowSceneTrainerPage";
import WordToPictureTrainerPage from "@/pages/logoped/WordToPictureTrainerPage";
import VerbToPictureTrainerPage from "@/pages/logoped/VerbToPictureTrainerPage";
import ChooseByFeatureTrainerPage from "@/pages/logoped/ChooseByFeatureTrainerPage";
import PictureAndWordTrainerPage from "@/pages/logoped/PictureAndWordTrainerPage";
import GenderMasculineTrainerPage from "@/pages/logoped/GenderMasculineTrainerPage";
import GenderFeminineTrainerPage from "@/pages/logoped/GenderFeminineTrainerPage";
import GenderNeuterTrainerPage from "@/pages/logoped/GenderNeuterTrainerPage";
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
import InstitutionPage from "@/pages/admin/InstitutionPage";
import StaffPage from "@/pages/admin/StaffPage";
import PositionsPage from "@/pages/admin/PositionsPage";
import RoomsPage from "@/pages/admin/RoomsPage";
import RoomTypesPage from "@/pages/admin/RoomTypesPage";
import EmployeeActivityTypesPage from "@/pages/admin/EmployeeActivityTypesPage";
import RolesPage from "@/pages/admin/RolesPage";

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
        <Route path="exercise-bank/trainer/word-parts" element={<WordPartsTrainerPage />} />
        <Route path="exercise-bank/trainer/letter-fix" element={<LetterFixTrainerPage />} />
        <Route path="exercise-bank/trainer/word-endings" element={<WordEndingsTrainerPage />} />
        <Route path="exercise-bank/trainer/phrase-builder" element={<PhraseBuilderTrainerPage />} />
        <Route
          path="exercise-bank/trainer/phrase-image-match"
          element={<PhraseImageMatchTrainerPage />}
        />
        <Route path="exercise-bank/trainer/adjective-noun" element={<AdjectiveNounTrainerPage />} />
        <Route path="exercise-bank/trainer/verb-to-image" element={<VerbToImageTrainerPage />} />
        <Route
          path="exercise-bank/trainer/syllable-insert"
          element={<SyllableInsertTrainerPage />}
        />
        <Route path="exercise-bank/trainer/verb-prefix" element={<VerbPrefixTrainerPage />} />
        <Route path="exercise-bank/trainer/verb-words" element={<VerbWordsTrainerPage />} />
        <Route path="exercise-bank/trainer/word-features" element={<WordFeaturesTrainerPage />} />
        <Route path="exercise-bank/trainer/verb-phrases" element={<VerbPhrasesTrainerPage />} />
        <Route path="exercise-bank/trainer/anagrams" element={<AnagramsTrainerPage />} />
        <Route path="exercise-bank/trainer/phrase-assembly" element={<PhraseAssemblyTrainerPage />} />
        <Route path="exercise-bank/trainer/common-noun" element={<CommonNounTrainerPage />} />
        <Route path="exercise-bank/trainer/common-adjective" element={<CommonAdjectiveTrainerPage />} />
        <Route path="exercise-bank/trainer/paronyms" element={<ParonymsTrainerPage />} />
        <Route path="exercise-bank/trainer/compose-phrase" element={<ComposePhraseTrainerPage />} />
        <Route path="exercise-bank/trainer/missing-letters" element={<MissingLettersTrainerPage />} />
        <Route path="exercise-bank/trainer/prepositions" element={<PrepositionsTrainerPage />} />
        <Route path="exercise-bank/trainer/letter-search" element={<LetterSearchTrainerPage />} />
        <Route path="exercise-bank/trainer/show-where" element={<ShowWhereTrainerPage />} />
        <Route path="exercise-bank/trainer/show-scene" element={<ShowSceneTrainerPage />} />
        <Route path="exercise-bank/trainer/word-to-picture" element={<WordToPictureTrainerPage />} />
        <Route path="exercise-bank/trainer/verb-to-picture" element={<VerbToPictureTrainerPage />} />
        <Route path="exercise-bank/trainer/choose-by-feature" element={<ChooseByFeatureTrainerPage />} />
        <Route path="exercise-bank/trainer/picture-and-word" element={<PictureAndWordTrainerPage />} />
        <Route path="exercise-bank/trainer/gender-masculine" element={<GenderMasculineTrainerPage />} />
        <Route path="exercise-bank/trainer/gender-feminine" element={<GenderFeminineTrainerPage />} />
        <Route path="exercise-bank/trainer/gender-neuter" element={<GenderNeuterTrainerPage />} />
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
        <Route index element={<Navigate to="/admin/institution" replace />} />
        <Route path="institution" element={<InstitutionPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="positions" element={<PositionsPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="room-types" element={<RoomTypesPage />} />
        <Route path="activity-types" element={<EmployeeActivityTypesPage />} />
        <Route path="roles" element={<RolesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
