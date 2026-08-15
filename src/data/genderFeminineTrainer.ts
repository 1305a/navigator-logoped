import type { GenderItem, GenderTask } from "./genderMasculineTrainer";

const imageModules = import.meta.glob("../assets/gender-feminine/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/gender-feminine/audio/*.mp3", {
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
  { id: 1, word: "ложка", image: "1.png" },
  { id: 2, word: "шапка", image: "2.png" },
  { id: 3, word: "дверь", image: "3.png" },
  { id: 4, word: "морковь", image: "4.png" },
  { id: 5, word: "чашка", image: "5.png" },
  { id: 6, word: "машина", image: "6.png" },
];

const RAW_TASKS = [
  { id: 1, instruction: "Покажи МАШИНУ", audio: "1.mp3", correctItemId: 6 },
  { id: 2, instruction: "Покажи ЛОЖКУ", audio: "2.mp3", correctItemId: 1 },
  { id: 3, instruction: "Покажи ШАПКУ", audio: "3.mp3", correctItemId: 2 },
  { id: 4, instruction: "Покажи ДВЕРЬ", audio: "4.mp3", correctItemId: 3 },
  { id: 5, instruction: "Покажи МОРКОВЬ", audio: "5.mp3", correctItemId: 4 },
  { id: 6, instruction: "Покажи ЧАШКУ", audio: "6.mp3", correctItemId: 5 },
  { id: 7, instruction: "Найди фарфоровую", audio: "7.mp3", correctItemId: 5 },
  { id: 8, instruction: "Найди сочную", audio: "8.mp3", correctItemId: 4 },
  { id: 9, instruction: "Найди столовую", audio: "9.mp3", correctItemId: 1 },
  { id: 10, instruction: "Найди тёплую", audio: "10.mp3", correctItemId: 2 },
  { id: 11, instruction: "Найди легковую", audio: "11.mp3", correctItemId: 6 },
  { id: 12, instruction: "Найди входную", audio: "12.mp3", correctItemId: 3 },
  { id: 13, instruction: "Что едят?", audio: "13.mp3", correctItemId: 4 },
  { id: 14, instruction: "Что вяжут?", audio: "14.mp3", correctItemId: 2 },
  { id: 15, instruction: "Из чего пьют?", audio: "15.mp3", correctItemId: 5 },
  { id: 16, instruction: "Что трут?", audio: "16.mp3", correctItemId: 4 },
  { id: 17, instruction: "Что закрывают?", audio: "17.mp3", correctItemId: 3 },
  { id: 18, instruction: "Чем едят?", audio: "18.mp3", correctItemId: 1 },
];

export const genderFeminineItems: GenderItem[] = RAW_ITEMS.map((i) => ({
  id: i.id,
  word: i.word,
  imageUrl: resolveImage(i.image),
}));

export const genderFeminineTasks: GenderTask[] = RAW_TASKS.map((t) => ({
  id: t.id,
  instruction: t.instruction,
  audioUrl: resolveAudio(t.audio),
  correctItemId: t.correctItemId,
}));
