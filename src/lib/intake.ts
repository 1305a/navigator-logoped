import {
  ADULT_BRANCHES,
  CHILD_BRANCHES,
  METHOD_NOTES,
  type IntakeAge,
  type IntakeBranch,
} from "@/data/intake";

export type { IntakeAge };
import type { IntakeState } from "@/data/types";

export function emptyIntakeState(): IntakeState {
  return {
    tab: "complaint",
    complaintId: null,
    answers: {},
    selectedCard: null,
    additionalVisited: false,
    riskFactors: {},
    mdt: {},
    icf: {},
    goals: [],
    diagApproved: false,
    goalsSaved: false,
  };
}

export function parseRuDateToDate(date: string): Date | null {
  const parts = date.split(".").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [d, m, y] = parts;
  return new Date(y, m - 1, d);
}

/** Age should come from the patient's birth date, not a manual toggle (see integration notes). */
export function deriveIntakeAge(birthDate: string): IntakeAge {
  const dob = parseRuDateToDate(birthDate);
  if (!dob) return "adult";
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) years -= 1;
  return years < 18 ? "child" : "adult";
}

export function branchesForAge(age: IntakeAge): IntakeBranch[] {
  return age === "child" ? CHILD_BRANCHES : ADULT_BRANCHES;
}

export function findBranch(age: IntakeAge, complaintId: string | null): IntakeBranch | undefined {
  if (!complaintId) return undefined;
  return branchesForAge(age).find((b) => b.id === complaintId);
}

export function resolvedCard(age: IntakeAge, intake: IntakeState): string | null {
  const branch = findBranch(age, intake.complaintId);
  if (!branch) return null;
  if (branch.card) return branch.card;
  return branch.resolve ? branch.resolve(intake.answers) : null;
}

/** Visible questions, accounting for the one conditional skip in the "progress" branch. */
export function visibleQuestions(branch: IntakeBranch, intake: IntakeState) {
  return branch.questions.filter(
    (q) => !(intake.complaintId === "progress" && q.id === "q1" && intake.answers.q0 === "Да"),
  );
}

export function answeredCount(age: IntakeAge, intake: IntakeState): [number, number] {
  const branch = findBranch(age, intake.complaintId);
  if (!branch) return [0, 0];
  const visible = visibleQuestions(branch, intake);
  const done = visible.filter((q) => intake.answers[q.id] !== undefined).length;
  return [done, visible.length];
}

function g(intake: IntakeState, id: string): string {
  const v = intake.answers[id];
  return typeof v === "string" && v ? v : "—";
}

function joinMulti(intake: IntakeState, id: string): string {
  const v = intake.answers[id];
  return Array.isArray(v) && v.length ? v.join(", ") : "—";
}

export function diagnosisText(age: IntakeAge, intake: IntakeState): string {
  const card = intake.selectedCard ?? resolvedCard(age, intake);
  const a = intake.answers;
  switch (intake.complaintId) {
    case "zrr":
      return `Задержка речевого развития. Первые слова — ${g(intake, "q1")}, активный словарь — ${g(intake, "q3")}. ${
        a.q4 === "Да" ? "Понимание обращённой речи опережает экспрессивную речь. " : ""
      }${a.q6 === "Да, есть снижение" ? "Рекомендовано уточнение состояния слуха. " : ""}Рекомендовано составление индивидуальной коррекционной программы.`;
    case "zvuk":
      return `Нарушение звукопроизношения. Затронуты группы звуков: ${joinMulti(intake, "q1")}. Характер нарушения: ${joinMulti(intake, "q2")}. Фраза сформирована ${g(intake, "q4").toLowerCase()}.`;
    case "zaikanie":
      return `Заикание, ${g(intake, "q3").toLowerCase()}. Начало — ${g(intake, "q1")}, ${g(intake, "q2").toLowerCase()}. ${
        a.q5 === "Да" ? "Отмечаются сопутствующие движения." : "Сопутствующие движения не отмечены."
      }`;
    case "dizartria":
      return `Дизартрия на фоне диагноза: ${g(intake, "q1")}. Разборчивость речи для окружающих: ${g(intake, "q4").toLowerCase()}. Характер голоса: ${joinMulti(intake, "q3")}.`;
    case "rinolalia":
      return `Ринолалия. Состояние нёба: ${g(intake, "q1").toLowerCase()}. Назальность голоса выражена: ${g(intake, "q2").toLowerCase()}.`;
    case "golos":
      return `Нарушение голоса. Изменение отмечается: ${g(intake, "q1").toLowerCase()}. Связь с голосовой нагрузкой: ${g(intake, "q2").toLowerCase()}.`;
    case "alalia":
      return `Подозрение на алалию. Разрыв между пониманием и собственной речью: ${g(intake, "q1").toLowerCase()}. Слух и РАС: ${g(intake, "q3").toLowerCase()}.`;
    case "insult":
      return `${card}. Понимание обращённой речи: ${g(intake, "q1").toLowerCase()}. Повторение: ${g(intake, "q3").toLowerCase()}. Артикуляция: ${g(intake, "q4").toLowerCase()}.`;
    case "progress":
      return card === "Когнитивно-коммуникативные нарушения"
        ? "Когнитивно-коммуникативные нарушения на фоне прогрессирующего заболевания. Основная жалоба — на память, внимание, организацию деятельности."
        : `Дизартрия у взрослых на фоне прогрессирующего заболевания. Перцептивный профиль: ${g(intake, "q1").toLowerCase()}.`;
    case "cogn":
      return `Когнитивно-коммуникативные нарушения. Диагноз: ${g(intake, "q4")}. Удержание темы: ${g(intake, "q1").toLowerCase()}, планирование рассказа: ${g(intake, "q2").toLowerCase()}.`;
    case "voice":
      return `Нарушение голоса у взрослого. Предполагаемая причина: ${g(intake, "q1").toLowerCase()}.`;
    case "stutter":
      return `Заикание у взрослого, ${g(intake, "q1").toLowerCase()}. Логофобия/избегающее поведение: ${g(intake, "q3").toLowerCase()}.`;
    default:
      return "";
  }
}

export function currentMethodNote(age: IntakeAge, intake: IntakeState): string {
  if (intake.tab === "complaint") return METHOD_NOTES.complaint[age];
  if (intake.tab === "questions") {
    return intake.complaintId ? METHOD_NOTES.questions[intake.complaintId] : METHOD_NOTES.complaint[age];
  }
  const card = intake.selectedCard ?? resolvedCard(age, intake);
  if (intake.tab === "card") {
    if (card === "Афазия") return METHOD_NOTES.card.afazia;
    if (card === "Задержка речевого развития / ОНР") return METHOD_NOTES.card.onr;
    return card ? METHOD_NOTES.card.draft : METHOD_NOTES.complaint[age];
  }
  if (intake.tab === "additional") return METHOD_NOTES.additional;
  if (intake.tab === "goals") return METHOD_NOTES.goals;

  const icfNote = METHOD_NOTES.diagnosisIcf + " ";
  if (intake.complaintId === "zrr") return icfNote + METHOD_NOTES.diagnosis.zrr;
  if (intake.complaintId === "insult") {
    if (card === "Афазия") return icfNote + METHOD_NOTES.diagnosis.insultAfazia;
    if (card === "Дизартрия у взрослых") return icfNote + METHOD_NOTES.diagnosis.insultDizartria;
    if (card === "Апраксия речи") return icfNote + METHOD_NOTES.diagnosis.insultApraksia;
  }
  if (intake.complaintId === "progress") return icfNote + METHOD_NOTES.diagnosis.progress;
  return icfNote + METHOD_NOTES.diagnosis.default;
}
