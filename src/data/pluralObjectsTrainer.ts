import type { GenderItem, GenderTask } from "@/data/genderMasculineTrainer";

const imageModules = import.meta.glob("../assets/plural-objects/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/plural-objects/audio/*.mp3", {
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
  { id: 1, word: "брюки", image: "1.png" },
  { id: 2, word: "волосы", image: "2.png" },
  { id: 3, word: "цветы", image: "3.png" },
  { id: 4, word: "глаза", image: "4.png" },
  { id: 5, word: "часы", image: "5.png" },
  { id: 6, word: "сапоги", image: "6.png" },
];

const RAW_TASKS = [
  { id: 1, instruction: "Покажите брюки.", audio: "1.mp3", correctItemId: 1 },
  { id: 2, instruction: "Покажите волосы.", audio: "2.mp3", correctItemId: 2 },
  { id: 3, instruction: "Покажите цветы.", audio: "3.mp3", correctItemId: 3 },
  { id: 4, instruction: "Покажите глаза.", audio: "4.mp3", correctItemId: 4 },
  { id: 5, instruction: "Покажите часы.", audio: "5.mp3", correctItemId: 5 },
  { id: 6, instruction: "Покажите сапоги.", audio: "6.mp3", correctItemId: 6 },
  { id: 7, instruction: "Найди кудрявые?", audio: "7.mp3", correctItemId: 2 },
  { id: 8, instruction: "Найди ароматные?", audio: "8.mp3", correctItemId: 3 },
  { id: 9, instruction: "Найди механические?", audio: "9.mp3", correctItemId: 5 },
  { id: 10, instruction: "Найди резиновые?", audio: "10.mp3", correctItemId: 6 },
  { id: 11, instruction: "Найди карие?", audio: "11.mp3", correctItemId: 4 },
  { id: 12, instruction: "Найди короткие?", audio: "12.mp3", correctItemId: 1 },
  { id: 13, instruction: "Что шьют?", audio: "13.mp3", correctItemId: 1 },
  { id: 14, instruction: "Что обувают?", audio: "14.mp3", correctItemId: 6 },
  { id: 15, instruction: "Что расчёсывают?", audio: "15.mp3", correctItemId: 2 },
  { id: 16, instruction: "Что распускается?", audio: "16.mp3", correctItemId: 3 },
  { id: 17, instruction: "Что тикает?", audio: "17.mp3", correctItemId: 5 },
  { id: 18, instruction: "Что щурят?", audio: "18.mp3", correctItemId: 4 },
];

export const pluralObjectsItems: GenderItem[] = RAW_ITEMS.map((i) => ({
  id: i.id,
  word: i.word,
  imageUrl: resolveImage(i.image),
}));

export const pluralObjectsTasks: GenderTask[] = RAW_TASKS.map((t) => ({
  id: t.id,
  instruction: t.instruction,
  audioUrl: resolveAudio(t.audio),
  correctItemId: t.correctItemId,
}));
