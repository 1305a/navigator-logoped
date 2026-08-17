const imageModules = import.meta.glob("../assets/attribute-match/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/attribute-match/audio/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(fileName: string): string | undefined {
  const key = Object.keys(imageModules).find((k) => k.endsWith(`/${fileName}`));
  return key ? imageModules[key] : undefined;
}
function resolveAudio(fileName: string): string | undefined {
  const key = Object.keys(audioModules).find((k) => k.endsWith(`/${fileName}`));
  return key ? audioModules[key] : undefined;
}

export interface AttributeOption {
  text: string;
  audioUrl?: string;
  isCorrect: boolean;
}

export interface AttributeTask {
  id: number;
  imageUrl?: string;
  word: { text: string; audioUrl?: string };
  actions: [AttributeOption, AttributeOption, AttributeOption];
}

const RAW_TASKS = [
  {
    id: 1,
    image: "1.png",
    word: { text: "Слон", audio: "word_01.mp3" },
    actions: [
      { text: "большой", audio: "action_01_01.mp3", isCorrect: true },
      { text: "бумажный", audio: "action_01_02.mp3", isCorrect: false },
      { text: "маленький", audio: "action_01_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 2,
    image: "2.png",
    word: { text: "Ремень", audio: "word_02.mp3" },
    actions: [
      { text: "кожаный", audio: "action_02_01.mp3", isCorrect: true },
      { text: "воздушный", audio: "action_02_02.mp3", isCorrect: false },
      { text: "деревянный", audio: "action_02_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 3,
    image: "3.png",
    word: { text: "Утюг", audio: "word_03.mp3" },
    actions: [
      { text: "горячий", audio: "action_03_01.mp3", isCorrect: true },
      { text: "мягкий", audio: "action_03_02.mp3", isCorrect: false },
      { text: "ледяной", audio: "action_03_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 4,
    image: "4.png",
    word: { text: "Книга", audio: "word_04.mp3" },
    actions: [
      { text: "интересная", audio: "action_04_01.mp3", isCorrect: true },
      { text: "стеклянная", audio: "action_04_02.mp3", isCorrect: false },
      { text: "невзрачная", audio: "action_04_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 5,
    image: "5.png",
    word: { text: "Волк", audio: "word_05.mp3" },
    actions: [
      { text: "злой", audio: "action_05_01.mp3", isCorrect: true },
      { text: "зелёный", audio: "action_05_02.mp3", isCorrect: false },
      { text: "нежный", audio: "action_05_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 6,
    image: "6.png",
    word: { text: "Цветок", audio: "word_06.mp3" },
    actions: [
      { text: "красивый", audio: "action_06_01.mp3", isCorrect: true },
      { text: "неуклюжий", audio: "action_06_02.mp3", isCorrect: false },
      { text: "жаркий", audio: "action_06_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 7,
    image: "7.png",
    word: { text: "Машина", audio: "word_07.mp3" },
    actions: [
      { text: "легковая", audio: "action_07_01.mp3", isCorrect: true },
      { text: "нежная", audio: "action_07_02.mp3", isCorrect: false },
      { text: "трудная", audio: "action_07_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 8,
    image: "8.png",
    word: { text: "Стакан", audio: "word_08.mp3" },
    actions: [
      { text: "стеклянный", audio: "action_08_01.mp3", isCorrect: true },
      { text: "шерстяной", audio: "action_08_02.mp3", isCorrect: false },
      { text: "ловкий", audio: "action_08_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 9,
    image: "9.png",
    word: { text: "Дом", audio: "word_09.mp3" },
    actions: [
      { text: "кирпичный", audio: "action_09_01.mp3", isCorrect: true },
      { text: "ранний", audio: "action_09_02.mp3", isCorrect: false },
      { text: "пуховый", audio: "action_09_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 10,
    image: "10.png",
    word: { text: "Тапки", audio: "word_10.mp3" },
    actions: [
      { text: "домашние", audio: "action_10_01.mp3", isCorrect: true },
      { text: "дикие", audio: "action_10_02.mp3", isCorrect: false },
      { text: "бальные", audio: "action_10_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 11,
    image: "11.png",
    word: { text: "Кошка", audio: "word_11.mp3" },
    actions: [
      { text: "пушистая", audio: "action_11_01.mp3", isCorrect: true },
      { text: "варёная", audio: "action_11_02.mp3", isCorrect: false },
      { text: "колючая", audio: "action_11_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 12,
    image: "12.png",
    word: { text: "Арбуз", audio: "word_12.mp3" },
    actions: [
      { text: "спелый", audio: "action_12_01.mp3", isCorrect: true },
      { text: "синий", audio: "action_12_02.mp3", isCorrect: false },
      { text: "вареный", audio: "action_12_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 13,
    image: "13.png",
    word: { text: "Дерево", audio: "word_13.mp3" },
    actions: [
      { text: "высокое", audio: "action_13_01.mp3", isCorrect: true },
      { text: "быстрое", audio: "action_13_02.mp3", isCorrect: false },
      { text: "рослое", audio: "action_13_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 14,
    image: "14.png",
    word: { text: "Куртка", audio: "word_14.mp3" },
    actions: [
      { text: "тёплая", audio: "action_14_01.mp3", isCorrect: true },
      { text: "железная", audio: "action_14_02.mp3", isCorrect: false },
      { text: "ледяная", audio: "action_14_03.mp3", isCorrect: false },
    ],
  },
  {
    id: 15,
    image: "15.png",
    word: { text: "Конфета", audio: "word_15.mp3" },
    actions: [
      { text: "шоколадная", audio: "action_15_01.mp3", isCorrect: true },
      { text: "звонкая", audio: "action_15_02.mp3", isCorrect: false },
      { text: "мясная", audio: "action_15_03.mp3", isCorrect: false },
    ],
  },
];

export const attributeTasks: AttributeTask[] = RAW_TASKS.map((t) => ({
  id: t.id,
  imageUrl: resolveImage(t.image),
  word: { text: t.word.text, audioUrl: resolveAudio(t.word.audio) },
  actions: t.actions.map((a) => ({
    text: a.text,
    audioUrl: resolveAudio(a.audio),
    isCorrect: a.isCorrect,
  })) as [AttributeOption, AttributeOption, AttributeOption],
}));
