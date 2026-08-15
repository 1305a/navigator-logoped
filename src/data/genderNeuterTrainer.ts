import type { GenderItem, GenderTask } from "./genderMasculineTrainer";

const imageModules = import.meta.glob("../assets/gender-neuter/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/gender-neuter/audio/*.mp3", {
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
  { id: 1, word: "дерево", image: "1.png" },
  { id: 2, word: "яйцо", image: "2.png" },
  { id: 3, word: "платье", image: "3.png" },
  { id: 4, word: "солнце", image: "4.png" },
  { id: 5, word: "окно", image: "5.png" },
  { id: 6, word: "такси", image: "6.png" },
];

const RAW_TASKS = [
  { id: 1, instruction: "Покажи ОКНО", audio: "1.mp3", correctItemId: 5 },
  { id: 2, instruction: "Покажи ДЕРЕВО", audio: "2.mp3", correctItemId: 1 },
  { id: 3, instruction: "Покажи ТАКСИ", audio: "3.mp3", correctItemId: 6 },
  { id: 4, instruction: "Покажи ЯЙЦО", audio: "4.mp3", correctItemId: 2 },
  { id: 5, instruction: "Покажи СОЛНЦЕ", audio: "5.mp3", correctItemId: 4 },
  { id: 6, instruction: "Покажи ПЛАТЬЕ", audio: "6.mp3", correctItemId: 3 },
  { id: 7, instruction: "Найди высокое", audio: "7.mp3", correctItemId: 1 },
  { id: 8, instruction: "Найди куриное", audio: "8.mp3", correctItemId: 2 },
  { id: 9, instruction: "Найди шёлковое", audio: "9.mp3", correctItemId: 3 },
  { id: 10, instruction: "Найди яркое", audio: "10.mp3", correctItemId: 4 },
  { id: 11, instruction: "Найди быстрое", audio: "11.mp3", correctItemId: 6 },
  { id: 12, instruction: "Найди стеклянное", audio: "12.mp3", correctItemId: 5 },
  { id: 13, instruction: "Что закрывают?", audio: "13.mp3", correctItemId: 5 },
  { id: 14, instruction: "Что светит?", audio: "14.mp3", correctItemId: 4 },
  { id: 15, instruction: "Что сажают?", audio: "15.mp3", correctItemId: 1 },
  { id: 16, instruction: "Что варят?", audio: "16.mp3", correctItemId: 2 },
  { id: 17, instruction: "Что носят?", audio: "17.mp3", correctItemId: 3 },
  { id: 18, instruction: "Что вызывают?", audio: "18.mp3", correctItemId: 6 },
];

export const genderNeuterItems: GenderItem[] = RAW_ITEMS.map((i) => ({
  id: i.id,
  word: i.word,
  imageUrl: resolveImage(i.image),
}));

export const genderNeuterTasks: GenderTask[] = RAW_TASKS.map((t) => ({
  id: t.id,
  instruction: t.instruction,
  audioUrl: resolveAudio(t.audio),
  correctItemId: t.correctItemId,
}));
