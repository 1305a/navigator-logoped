const imageModules = import.meta.glob("../assets/verb-actions/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/verb-actions/audio/*.mp3", {
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

export interface VerbActionWord {
  id: number;
  word: string;
  variants: string[];
  audioUrl?: string;
  imageUrl?: string;
}

export interface VerbActionTask {
  id: number;
  words: [VerbActionWord, VerbActionWord];
}

const RAW_TASKS = [
  {
    id: 1,
    words: [
      { id: 1, word: "идёт", variants: ["идёт", "летит", "бежит"], audio: "1_1.mp3", image: "1_1.png" },
      { id: 2, word: "стоит", variants: ["стоит", "сидит", "думает"], audio: "1_2.mp3", image: "1_2.png" },
    ],
  },
  {
    id: 2,
    words: [
      { id: 1, word: "летит", variants: ["летит", "порхает", "машет"], audio: "2_1.mp3", image: "2_1.png" },
      { id: 2, word: "ползёт", variants: ["ползёт", "карабкается", "течёт"], audio: "2_2.mp3", image: "2_2.png" },
    ],
  },
  {
    id: 3,
    words: [
      { id: 1, word: "смеётся", variants: ["смеётся", "улыбается", "поёт"], audio: "3_1.mp3", image: "3_1.png" },
      { id: 2, word: "плачет", variants: ["плачет", "грустит", "читает"], audio: "3_2.mp3", image: "3_2.png" },
    ],
  },
  {
    id: 4,
    words: [
      { id: 1, word: "пьёт", variants: ["пьёт", "глотает", "чистит"], audio: "4_1.mp3", image: "4_1.png" },
      { id: 2, word: "ест", variants: ["ест", "жуёт", "лечит"], audio: "4_2.mp3", image: "4_2.png" },
    ],
  },
  {
    id: 5,
    words: [
      { id: 1, word: "сидит", variants: ["сидит", "отдыхает", "стоит"], audio: "5_1.mp3", image: "5_1.png" },
      { id: 2, word: "лежит", variants: ["лежит", "спит", "мешает"], audio: "5_2.mp3", image: "5_2.png" },
    ],
  },
  {
    id: 6,
    words: [
      { id: 1, word: "молчит", variants: ["молчит", "думает", "болеет"], audio: "6_1.mp3", image: "6_1.png" },
      { id: 2, word: "кричит", variants: ["кричит", "поёт", "смеётся"], audio: "6_2.mp3", image: "6_2.png" },
    ],
  },
  {
    id: 7,
    words: [
      { id: 1, word: "работает", variants: ["работает", "строит", "лепит"], audio: "7_1.mp3", image: "7_1.png" },
      { id: 2, word: "отдыхает", variants: ["отдыхает", "гуляет", "пилит"], audio: "7_2.mp3", image: "7_2.png" },
    ],
  },
  {
    id: 8,
    words: [
      { id: 1, word: "чистит", variants: ["чистит", "моет", "рисует"], audio: "8_1.mp3", image: "8_1.png" },
      { id: 2, word: "пачкает", variants: ["пачкает", "мажет", "крутит"], audio: "8_2.mp3", image: "8_2.png" },
    ],
  },
  {
    id: 9,
    words: [
      { id: 1, word: "строит", variants: ["строит", "кладёт", "собирает"], audio: "9_1.mp3", image: "9_1.png" },
      { id: 2, word: "ломает", variants: ["ломает", "рубит", "вешает"], audio: "9_2.mp3", image: "9_2.png" },
    ],
  },
  {
    id: 10,
    words: [
      { id: 1, word: "покупает", variants: ["покупает", "берёт", "тащит"], audio: "10_1.mp3", image: "10_1.png" },
      { id: 2, word: "продаёт", variants: ["продаёт", "дарит", "делит"], audio: "10_2.mp3", image: "10_2.png" },
    ],
  },
  {
    id: 11,
    words: [
      { id: 1, word: "читает", variants: ["читает", "учит", "ест"], audio: "11_1.mp3", image: "11_1.png" },
      { id: 2, word: "пишет", variants: ["пишет", "рисует", "лепит"], audio: "11_2.mp3", image: "11_2.png" },
    ],
  },
  {
    id: 12,
    words: [
      { id: 1, word: "копит", variants: ["копит", "кладёт", "чистит"], audio: "12_1.mp3", image: "12_1.png" },
      { id: 2, word: "тратит", variants: ["тратит", "бросает", "гладит"], audio: "12_2.mp3", image: "12_2.png" },
    ],
  },
  {
    id: 13,
    words: [
      { id: 1, word: "прячет", variants: ["прячет", "скрывает", "вешает"], audio: "13_1.mp3", image: "13_1.png" },
      { id: 2, word: "ищет", variants: ["ищет", "нюхает", "бежит"], audio: "13_2.mp3", image: "13_2.png" },
    ],
  },
  {
    id: 14,
    words: [
      { id: 1, word: "встречает", variants: ["встречает", "дарит", "выступает"], audio: "14_1.mp3", image: "14_1.png" },
      { id: 2, word: "провожает", variants: ["провожает", "зовёт", "смотрит"], audio: "14_2.mp3", image: "14_2.png" },
    ],
  },
  {
    id: 15,
    words: [
      { id: 1, word: "замерзает", variants: ["замерзает", "холодит", "одевает"], audio: "15_1.mp3", image: "15_1.png" },
      { id: 2, word: "тает", variants: ["тает", "греет", "плывёт"], audio: "15_2.mp3", image: "15_2.png" },
    ],
  },
];

export const verbActionTasks: VerbActionTask[] = RAW_TASKS.map((t) => ({
  id: t.id,
  words: t.words.map((w) => ({
    id: w.id,
    word: w.word,
    variants: w.variants,
    audioUrl: resolveAudio(w.audio),
    imageUrl: resolveImage(w.image),
  })) as [VerbActionWord, VerbActionWord],
}));
