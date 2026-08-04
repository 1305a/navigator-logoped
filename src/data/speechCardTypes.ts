export type SpeechCardQuestionType = "checkbox" | "select";

export interface SpeechCardQuestion {
  id: string;
  text: string;
  type: SpeechCardQuestionType;
  options?: string[];
}

export interface SpeechCardTypeDef {
  id: string;
  label: string;
  questions: SpeechCardQuestion[];
}

export const speechCardTypes: SpeechCardTypeDef[] = [
  {
    id: "aphasia",
    label: "Карта для афазии",
    questions: [
      {
        id: "aphasiaForm",
        text: "Какая форма афазии предполагается?",
        type: "select",
        options: ["Моторная", "Сенсорная", "Сенсомоторная"],
      },
      { id: "comprehensionPreserved", text: "Сохранено ли понимание обращённой речи?", type: "checkbox" },
      {
        id: "wordFindingDifficulty",
        text: "Насколько выражены трудности с подбором слов?",
        type: "select",
        options: ["Незначительные", "Умеренные", "Выраженные"],
      },
    ],
  },
  {
    id: "dysarthria",
    label: "Карта для дизартрии",
    questions: [
      {
        id: "dysarthriaSeverity",
        text: "Степень тяжести дизартрии?",
        type: "select",
        options: ["Лёгкая", "Средняя", "Тяжёлая"],
      },
      { id: "muscleTone", text: "Есть ли нарушения тонуса артикуляционной мускулатуры?", type: "checkbox" },
      { id: "salivation", text: "Сопровождается ли речь избыточным слюнотечением?", type: "checkbox" },
    ],
  },
  {
    id: "stuttering",
    label: "Карта для заикания",
    questions: [
      {
        id: "stutteringForm",
        text: "Форма заикания?",
        type: "select",
        options: ["Невротическая", "Неврозоподобная", "Смешанная"],
      },
      { id: "worsensWithAnxiety", text: "Усиливаются ли запинки при волнении?", type: "checkbox" },
      {
        id: "accompanyingMovements",
        text: "Присутствуют ли сопутствующие движения (тики, гримасы)?",
        type: "checkbox",
      },
    ],
  },
  {
    id: "onr",
    label: "Карта для ОНР/ЗРР",
    questions: [
      {
        id: "developmentLevel",
        text: "Уровень речевого развития?",
        type: "select",
        options: ["I уровень", "II уровень", "III уровень"],
      },
      {
        id: "vocabularyAgeAppropriate",
        text: "Соответствует ли словарный запас возрастной норме?",
        type: "checkbox",
      },
      { id: "grammarImpaired", text: "Есть ли нарушения грамматического строя речи?", type: "checkbox" },
    ],
  },
  {
    id: "dyslalia",
    label: "Карта для дислалии",
    questions: [
      {
        id: "dyslaliaForm",
        text: "Форма дислалии?",
        type: "select",
        options: ["Механическая", "Функциональная"],
      },
      {
        id: "sibilantsImpaired",
        text: "Нарушено ли произношение свистящих и шипящих звуков?",
        type: "checkbox",
      },
      { id: "rSoundImpaired", text: "Нарушено ли произношение звука [Р]?", type: "checkbox" },
    ],
  },
];
