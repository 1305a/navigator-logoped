export interface ShowWhereWord {
  id: number;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface ShowWhereSet {
  id: number;
  words: ShowWhereWord[];
}

const imageModules = import.meta.glob("../assets/show-where/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/show-where/audio/*.mp3", {
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

type RawWord = { id: number; text: string; image: string; audio: string };

const RAW: Array<{ id: number; words: RawWord[] }> = [
  { id: 1, words: [{ id: 1, text: "шкаф", image: "1_1.png", audio: "word_1_1.mp3" }, { id: 2, text: "слива", image: "1_2.png", audio: "word_1_2.mp3" }, { id: 3, text: "ботинки", image: "1_3.png", audio: "word_1_3.mp3" }, { id: 4, text: "молоток", image: "1_4.png", audio: "word_1_4.mp3" }, { id: 5, text: "солнце", image: "1_5.png", audio: "word_1_5.mp3" }, { id: 6, text: "плита", image: "1_6.png", audio: "word_1_6.mp3" }] },
  { id: 2, words: [{ id: 1, text: "яйцо", image: "2_1.png", audio: "word_2_1.mp3" }, { id: 2, text: "чашка", image: "2_2.png", audio: "word_2_2.mp3" }, { id: 3, text: "лопата", image: "2_3.png", audio: "word_2_3.mp3" }, { id: 4, text: "брюки", image: "2_4.png", audio: "word_2_4.mp3" }, { id: 5, text: "туча", image: "2_5.png", audio: "word_2_5.mp3" }, { id: 6, text: "холодильник", image: "2_6.png", audio: "word_2_6.mp3" }] },
  { id: 3, words: [{ id: 1, text: "капуста", image: "3_1.png", audio: "word_3_1.mp3" }, { id: 2, text: "шляпа", image: "3_2.png", audio: "word_3_2.mp3" }, { id: 3, text: "ложка", image: "3_3.png", audio: "word_3_3.mp3" }, { id: 4, text: "машина", image: "3_4.png", audio: "word_3_4.mp3" }, { id: 5, text: "телевизор", image: "3_5.png", audio: "word_3_5.mp3" }, { id: 6, text: "очки", image: "3_6.png", audio: "word_3_6.mp3" }] },
  { id: 4, words: [{ id: 1, text: "тарелка", image: "4_1.png", audio: "word_4_1.mp3" }, { id: 2, text: "халат", image: "4_2.png", audio: "word_4_2.mp3" }, { id: 3, text: "картошка", image: "4_3.png", audio: "word_4_3.mp3" }, { id: 4, text: "молоко", image: "4_4.png", audio: "word_4_4.mp3" }, { id: 5, text: "лужа", image: "4_5.png", audio: "word_4_5.mp3" }, { id: 6, text: "часы", image: "4_6.png", audio: "word_4_6.mp3" }] },
  { id: 5, words: [{ id: 1, text: "стул", image: "5_1.png", audio: "word_5_1.mp3" }, { id: 2, text: "майка", image: "5_2.png", audio: "word_5_2.mp3" }, { id: 3, text: "перец", image: "5_3.png", audio: "word_5_3.mp3" }, { id: 4, text: "велосипед", image: "5_4.png", audio: "word_5_4.mp3" }, { id: 5, text: "пиво", image: "5_5.png", audio: "word_5_5.mp3" }, { id: 6, text: "телефон", image: "5_6.png", audio: "word_5_6.mp3" }] },
  { id: 6, words: [{ id: 1, text: "кастрюля", image: "6_1.png", audio: "word_6_1.mp3" }, { id: 2, text: "малина", image: "6_2.png", audio: "word_6_2.mp3" }, { id: 3, text: "тапочки", image: "6_3.png", audio: "word_6_3.mp3" }, { id: 4, text: "корова", image: "6_4.png", audio: "word_6_4.mp3" }, { id: 5, text: "сережки", image: "6_5.png", audio: "word_6_5.mp3" }, { id: 6, text: "глаза", image: "6_6.png", audio: "word_6_6.mp3" }] },
  { id: 7, words: [{ id: 1, text: "таз", image: "7_1.png", audio: "word_7_1.mp3" }, { id: 2, text: "банан", image: "7_2.png", audio: "word_7_2.mp3" }, { id: 3, text: "корабль", image: "7_3.png", audio: "word_7_3.mp3" }, { id: 4, text: "веник", image: "7_4.png", audio: "word_7_4.mp3" }, { id: 5, text: "медведь", image: "7_5.png", audio: "word_7_5.mp3" }, { id: 6, text: "бусы", image: "7_6.png", audio: "word_7_6.mp3" }] },
  { id: 8, words: [{ id: 1, text: "диван", image: "8_1.png", audio: "word_8_1.mp3" }, { id: 2, text: "пижама", image: "8_2.png", audio: "word_8_2.mp3" }, { id: 3, text: "хлеб", image: "8_3.png", audio: "word_8_3.mp3" }, { id: 4, text: "пылесос", image: "8_4.png", audio: "word_8_4.mp3" }, { id: 5, text: "белка", image: "8_5.png", audio: "word_8_5.mp3" }, { id: 6, text: "кольцо", image: "8_6.png", audio: "word_8_6.mp3" }] },
  { id: 9, words: [{ id: 1, text: "вилка", image: "9_1.png", audio: "word_9_1.mp3" }, { id: 2, text: "морковь", image: "9_2.png", audio: "word_9_2.mp3" }, { id: 3, text: "поезд", image: "9_3.png", audio: "word_9_3.mp3" }, { id: 4, text: "сапоги", image: "9_4.png", audio: "word_9_4.mp3" }, { id: 5, text: "крыса", image: "9_5.png", audio: "word_9_5.mp3" }, { id: 6, text: "нос", image: "9_6.png", audio: "word_9_6.mp3" }] },
  { id: 10, words: [{ id: 1, text: "стол", image: "10_1.png", audio: "word_10_1.mp3" }, { id: 2, text: "пальто", image: "10_2.png", audio: "word_10_2.mp3" }, { id: 3, text: "арбуз", image: "10_3.png", audio: "word_10_3.mp3" }, { id: 4, text: "чай", image: "10_4.png", audio: "word_10_4.mp3" }, { id: 5, text: "пила", image: "10_5.png", audio: "word_10_5.mp3" }, { id: 6, text: "кошка", image: "10_6.png", audio: "word_10_6.mp3" }] },
  { id: 11, words: [{ id: 1, text: "ножницы", image: "11_1.png", audio: "word_11_1.mp3" }, { id: 2, text: "кабачок", image: "11_2.png", audio: "word_11_2.mp3" }, { id: 3, text: "кофе", image: "11_3.png", audio: "word_11_3.mp3" }, { id: 4, text: "кисть", image: "11_4.png", audio: "word_11_4.mp3" }, { id: 5, text: "собака", image: "11_5.png", audio: "word_11_5.mp3" }, { id: 6, text: "нога", image: "11_6.png", audio: "word_11_6.mp3" }] },
  { id: 12, words: [{ id: 1, text: "горшок", image: "12_1.png", audio: "word_12_1.mp3" }, { id: 2, text: "тыква", image: "12_2.png", audio: "word_12_2.mp3" }, { id: 3, text: "автобус", image: "12_3.png", audio: "word_12_3.mp3" }, { id: 4, text: "сок", image: "12_4.png", audio: "word_12_4.mp3" }, { id: 5, text: "рука", image: "12_5.png", audio: "word_12_5.mp3" }, { id: 6, text: "чемодан", image: "12_6.png", audio: "word_12_6.mp3" }] },
  { id: 13, words: [{ id: 1, text: "кресло", image: "13_1.png", audio: "word_13_1.mp3" }, { id: 2, text: "помидор", image: "13_2.png", audio: "word_13_2.mp3" }, { id: 3, text: "туфли", image: "13_3.png", audio: "word_13_3.mp3" }, { id: 4, text: "топор", image: "13_4.png", audio: "word_13_4.mp3" }, { id: 5, text: "книга", image: "13_5.png", audio: "word_13_5.mp3" }, { id: 6, text: "лягушка", image: "13_6.png", audio: "word_13_6.mp3" }] },
  { id: 14, words: [{ id: 1, text: "юбка", image: "14_1.png", audio: "word_14_1.mp3" }, { id: 2, text: "апельсин", image: "14_2.png", audio: "word_14_2.mp3" }, { id: 3, text: "мотоцикл", image: "14_3.png", audio: "word_14_3.mp3" }, { id: 4, text: "кеды", image: "14_4.png", audio: "word_14_4.mp3" }, { id: 5, text: "ручка", image: "14_5.png", audio: "word_14_5.mp3" }, { id: 6, text: "зонт", image: "14_6.png", audio: "word_14_6.mp3" }] },
  { id: 15, words: [{ id: 1, text: "платье", image: "15_1.png", audio: "word_15_1.mp3" }, { id: 2, text: "персик", image: "15_2.png", audio: "word_15_2.mp3" }, { id: 3, text: "самолёт", image: "15_3.png", audio: "word_15_3.mp3" }, { id: 4, text: "нож", image: "15_4.png", audio: "word_15_4.mp3" }, { id: 5, text: "лампа", image: "15_5.png", audio: "word_15_5.mp3" }, { id: 6, text: "лестница", image: "15_6.png", audio: "word_15_6.mp3" }] },
];

export const showWhereSets: ShowWhereSet[] = RAW.map((s) => ({
  id: s.id,
  words: s.words.map((w) => ({
    id: w.id,
    text: w.text,
    imageUrl: resolveImage(w.image),
    audioUrl: resolveAudio(w.audio),
  })),
}));
