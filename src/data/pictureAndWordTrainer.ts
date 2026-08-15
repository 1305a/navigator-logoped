export interface PictureWord {
  id: number;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface PictureWordTask {
  id: number;
  words: PictureWord[];
}

const imageModules = import.meta.glob("../assets/picture-and-word/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/picture-and-word/audio/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(fileName: string): string | undefined {
  const key = Object.keys(imageModules).find((k) => k.endsWith(`/${fileName}`));
  return key ? imageModules[key] : undefined;
}
export function resolvePictureWordAudio(fileName: string): string | undefined {
  const key = Object.keys(audioModules).find((k) => k.endsWith(`/${fileName}`));
  return key ? audioModules[key] : undefined;
}

type RawWord = { id: number; text: string; audio: string; image: string };

const RAW: Array<{ id: number; words: RawWord[] }> = [
  { id: 1, words: [{ id: 1, text: "очки", audio: "word_01_01.mp3", image: "1_1.png" }, { id: 2, text: "дерево", audio: "word_01_02.mp3", image: "1_2.png" }, { id: 3, text: "часы", audio: "word_01_03.mp3", image: "1_3.png" }] },
  { id: 2, words: [{ id: 1, text: "ручка", audio: "word_02_01.mp3", image: "2_1.png" }, { id: 2, text: "бутылка", audio: "word_02_02.mp3", image: "2_2.png" }, { id: 3, text: "карандаш", audio: "word_02_03.mp3", image: "2_3.png" }] },
  { id: 3, words: [{ id: 1, text: "телефон", audio: "word_03_01.mp3", image: "3_1.png" }, { id: 2, text: "диван", audio: "word_03_02.mp3", image: "3_2.png" }, { id: 3, text: "телевизор", audio: "word_03_03.mp3", image: "3_3.png" }] },
  { id: 4, words: [{ id: 1, text: "книга", audio: "word_04_01.mp3", image: "4_1.png" }, { id: 2, text: "дом", audio: "word_04_02.mp3", image: "4_2.png" }, { id: 3, text: "газета", audio: "word_04_03.mp3", image: "4_3.png" }] },
  { id: 5, words: [{ id: 1, text: "яблоко", audio: "word_05_01.mp3", image: "5_1.png" }, { id: 2, text: "корова", audio: "word_05_02.mp3", image: "5_2.png" }, { id: 3, text: "груша", audio: "word_05_03.mp3", image: "5_3.png" }] },
  { id: 6, words: [{ id: 1, text: "ложка", audio: "word_06_01.mp3", image: "6_1.png" }, { id: 2, text: "шапка", audio: "word_06_02.mp3", image: "6_2.png" }, { id: 3, text: "вилка", audio: "word_06_03.mp3", image: "6_3.png" }] },
  { id: 7, words: [{ id: 1, text: "кофта", audio: "word_07_01.mp3", image: "7_1.png" }, { id: 2, text: "яйцо", audio: "word_07_02.mp3", image: "7_2.png" }, { id: 3, text: "платье", audio: "word_07_03.mp3", image: "7_3.png" }] },
  { id: 8, words: [{ id: 1, text: "машина", audio: "word_08_01.mp3", image: "8_1.png" }, { id: 2, text: "скрепка", audio: "word_08_02.mp3", image: "8_2.png" }, { id: 3, text: "автобус", audio: "word_08_03.mp3", image: "8_3.png" }] },
  { id: 9, words: [{ id: 1, text: "рука", audio: "word_09_01.mp3", image: "9_1.png" }, { id: 2, text: "лампа", audio: "word_09_02.mp3", image: "9_2.png" }, { id: 3, text: "нога", audio: "word_09_03.mp3", image: "9_3.png" }] },
  { id: 10, words: [{ id: 1, text: "хлеб", audio: "word_10_01.mp3", image: "10_1.png" }, { id: 2, text: "рыба", audio: "word_10_02.mp3", image: "10_2.png" }, { id: 3, text: "пирог", audio: "word_10_03.mp3", image: "10_3.png" }] },
  { id: 11, words: [{ id: 1, text: "подушка", audio: "word_11_01.mp3", image: "11_1.png" }, { id: 2, text: "цветок", audio: "word_11_02.mp3", image: "11_2.png" }, { id: 3, text: "одеяло", audio: "word_11_03.mp3", image: "11_3.png" }] },
  { id: 12, words: [{ id: 1, text: "тапки", audio: "word_12_01.mp3", image: "12_1.png" }, { id: 2, text: "шкаф", audio: "word_12_02.mp3", image: "12_2.png" }, { id: 3, text: "сапоги", audio: "word_12_03.mp3", image: "12_3.png" }] },
  { id: 13, words: [{ id: 1, text: "кошка", audio: "word_13_01.mp3", image: "13_1.png" }, { id: 2, text: "самолёт", audio: "word_13_02.mp3", image: "13_2.png" }, { id: 3, text: "собака", audio: "word_13_03.mp3", image: "13_3.png" }] },
  { id: 14, words: [{ id: 1, text: "окно", audio: "word_14_01.mp3", image: "14_1.png" }, { id: 2, text: "сумка", audio: "word_14_02.mp3", image: "14_2.png" }, { id: 3, text: "дверь", audio: "word_14_03.mp3", image: "14_3.png" }] },
  { id: 15, words: [{ id: 1, text: "солнце", audio: "word_15_01.mp3", image: "15_1.png" }, { id: 2, text: "тарелка", audio: "word_15_02.mp3", image: "15_2.png" }, { id: 3, text: "туча", audio: "word_15_03.mp3", image: "15_3.png" }] },
];

export const pictureWordTasks: PictureWordTask[] = RAW.map((t) => ({
  id: t.id,
  words: t.words.map((w) => ({
    id: w.id,
    text: w.text,
    imageUrl: resolveImage(w.image),
    audioUrl: resolvePictureWordAudio(w.audio),
  })),
}));

export const whatIsItAudioUrl = resolvePictureWordAudio("whatisit.mp3");
