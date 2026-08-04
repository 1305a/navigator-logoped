export type PreliminaryQuestionType = "checkbox" | "select";

export interface PreliminaryQuestion {
  id: string;
  text: string;
  type: PreliminaryQuestionType;
  options?: string[];
}

export const preliminaryQuestions: PreliminaryQuestion[] = [
  { id: "stuttering", text: "Есть ли заикание у пациента?", type: "checkbox" },
  {
    id: "speechRate",
    text: "Как быстро пациент разговаривает?",
    type: "select",
    options: ["Медленно", "Нормально", "Быстро"],
  },
  {
    id: "soundErrors",
    text: "Наблюдаются ли трудности с произношением отдельных звуков?",
    type: "checkbox",
  },
  { id: "speechDelay", text: "Есть ли задержка речевого развития по возрасту?", type: "checkbox" },
  {
    id: "comprehension",
    text: "Как пациент понимает обращённую речь?",
    type: "select",
    options: ["Затруднено", "Частично", "В полном объёме"],
  },
  { id: "breathing", text: "Есть ли нарушения дыхания во время речи?", type: "checkbox" },
  {
    id: "intelligibility",
    text: "Насколько разборчива речь пациента для окружающих?",
    type: "select",
    options: ["Низкая", "Средняя", "Высокая"],
  },
  {
    id: "repetition",
    text: "Отмечается ли повторение слов или слогов (запинки)?",
    type: "checkbox",
  },
];
