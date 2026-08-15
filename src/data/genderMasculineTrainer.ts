export interface GenderItem {
  id: number;
  word: string;
  imageUrl?: string;
}

export interface GenderTask {
  id: number;
  instruction: string;
  audioUrl?: string;
  correctItemId: number;
}

const imageModules = import.meta.glob("../assets/gender-masculine/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/gender-masculine/audio/*.mp3", {
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

const RAW_ITEMS = [
  { id: 1, word: "свитер", image: "1.png" },
  { id: 2, word: "диван", image: "2.png" },
  { id: 3, word: "чайник", image: "3.png" },
  { id: 4, word: "лук", image: "4.png" },
  { id: 5, word: "нож", image: "5.png" },
  { id: 6, word: "хлеб", image: "6.png" },
];

const RAW_TASKS = [
  { id: 1, instruction: "Покажи СВИТЕР", audio: "1.mp3", correctItemId: 1 },
  { id: 2, instruction: "Покажи ДИВАН", audio: "2.mp3", correctItemId: 2 },
  { id: 3, instruction: "Покажи ЧАЙНИК", audio: "3.mp3", correctItemId: 3 },
  { id: 4, instruction: "Покажи ЛУК", audio: "4.mp3", correctItemId: 4 },
  { id: 5, instruction: "Покажи НОЖ", audio: "5.mp3", correctItemId: 5 },
  { id: 6, instruction: "Покажи ХЛЕБ", audio: "6.mp3", correctItemId: 6 },
  { id: 7, instruction: "Найди шерстяной", audio: "7.mp3", correctItemId: 1 },
  { id: 8, instruction: "Найди ржаной", audio: "8.mp3", correctItemId: 6 },
  { id: 9, instruction: "Найди раскладной", audio: "9.mp3", correctItemId: 2 },
  { id: 10, instruction: "Найди горячий", audio: "10.mp3", correctItemId: 3 },
  { id: 11, instruction: "Найди острый", audio: "11.mp3", correctItemId: 5 },
  { id: 12, instruction: "Найди репчатый", audio: "12.mp3", correctItemId: 4 },
  { id: 13, instruction: "Чем режут?", audio: "13.mp3", correctItemId: 5 },
  { id: 14, instruction: "Что пекут?", audio: "14.mp3", correctItemId: 6 },
  { id: 15, instruction: "Что носят?", audio: "15.mp3", correctItemId: 1 },
  { id: 16, instruction: "На чём сидят?", audio: "16.mp3", correctItemId: 2 },
  { id: 17, instruction: "Что кипит?", audio: "17.mp3", correctItemId: 3 },
  { id: 18, instruction: "Что растёт?", audio: "18.mp3", correctItemId: 4 },
];

export const genderMasculineItems: GenderItem[] = RAW_ITEMS.map((i) => ({
  id: i.id,
  word: i.word,
  imageUrl: resolveImage(i.image),
}));

export const genderMasculineTasks: GenderTask[] = RAW_TASKS.map((t) => ({
  id: t.id,
  instruction: t.instruction,
  audioUrl: resolveAudio(t.audio),
  correctItemId: t.correctItemId,
}));
