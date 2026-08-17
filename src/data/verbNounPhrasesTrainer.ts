const imageModules = import.meta.glob("../assets/verb-noun-phrases/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/verb-noun-phrases/audio/*.mp3", {
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

export interface VerbNounPhrase {
  id: number;
  phrase: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface VerbNounTask {
  id: number;
  phrases: [VerbNounPhrase, VerbNounPhrase, VerbNounPhrase, VerbNounPhrase];
}

const RAW_TASKS = [
  {
    id: 1,
    phrases: [
      { id: 1, phrase: "режет хлеб", audio: "1_1.mp3", image: "1_1.png" },
      { id: 2, phrase: "несёт сумку", audio: "1_2.mp3", image: "1_2.png" },
      { id: 3, phrase: "ест суп", audio: "1_3.mp3", image: "1_3.png" },
      { id: 4, phrase: "режет бумагу", audio: "1_4.mp3", image: "1_4.png" },
    ],
  },
  {
    id: 2,
    phrases: [
      { id: 1, phrase: "рубит дрова", audio: "2_1.mp3", image: "2_1.png" },
      { id: 2, phrase: "моет полы", audio: "2_2.mp3", image: "2_2.png" },
      { id: 3, phrase: "пилит бревно", audio: "2_3.mp3", image: "2_3.png" },
      { id: 4, phrase: "рубит мясо", audio: "2_4.mp3", image: "2_4.png" },
    ],
  },
  {
    id: 3,
    phrases: [
      { id: 1, phrase: "стрижёт ногти", audio: "3_1.mp3", image: "3_1.png" },
      { id: 2, phrase: "закрывает дверь", audio: "3_2.mp3", image: "3_2.png" },
      { id: 3, phrase: "расчёсывает волосы", audio: "3_3.mp3", image: "3_3.png" },
      { id: 4, phrase: "стрижёт траву", audio: "3_4.mp3", image: "3_4.png" },
    ],
  },
  {
    id: 4,
    phrases: [
      { id: 1, phrase: "чистит ботинки", audio: "4_1.mp3", image: "4_1.png" },
      { id: 2, phrase: "гладит платок", audio: "4_2.mp3", image: "4_2.png" },
      { id: 3, phrase: "надевает носки", audio: "4_3.mp3", image: "4_3.png" },
      { id: 4, phrase: "чистит апельсин", audio: "4_4.mp3", image: "4_4.png" },
    ],
  },
  {
    id: 5,
    phrases: [
      { id: 1, phrase: "забивает гвоздь", audio: "5_1.mp3", image: "5_1.png" },
      { id: 2, phrase: "застилает постель", audio: "5_2.mp3", image: "5_2.png" },
      { id: 3, phrase: "сверлит дырку", audio: "5_3.mp3", image: "5_3.png" },
      { id: 4, phrase: "забивает мяч", audio: "5_4.mp3", image: "5_4.png" },
    ],
  },
  {
    id: 6,
    phrases: [
      { id: 1, phrase: "пишет письмо", audio: "6_1.mp3", image: "6_1.png" },
      { id: 2, phrase: "наливает воду", audio: "6_2.mp3", image: "6_2.png" },
      { id: 3, phrase: "читает книгу", audio: "6_3.mp3", image: "6_3.png" },
      { id: 4, phrase: "пишет картину", audio: "6_4.mp3", image: "6_4.png" },
    ],
  },
  {
    id: 7,
    phrases: [
      { id: 1, phrase: "гладит юбку", audio: "7_1.mp3", image: "7_1.png" },
      { id: 2, phrase: "бросает фантик", audio: "7_2.mp3", image: "7_2.png" },
      { id: 3, phrase: "стирает брюки", audio: "7_3.mp3", image: "7_3.png" },
      { id: 4, phrase: "гладит кошку", audio: "7_4.mp3", image: "7_4.png" },
    ],
  },
  {
    id: 8,
    phrases: [
      { id: 1, phrase: "зашивает дырку", audio: "8_1.mp3", image: "8_1.png" },
      { id: 2, phrase: "поливает цветок", audio: "8_2.mp3", image: "8_2.png" },
      { id: 3, phrase: "вяжет шарф", audio: "8_3.mp3", image: "8_3.png" },
      { id: 4, phrase: "зашивает рану", audio: "8_4.mp3", image: "8_4.png" },
    ],
  },
  {
    id: 9,
    phrases: [
      { id: 1, phrase: "стирает бельё", audio: "9_1.mp3", image: "9_1.png" },
      { id: 2, phrase: "красит ногти", audio: "9_2.mp3", image: "9_2.png" },
      { id: 3, phrase: "моет полы", audio: "9_3.mp3", image: "9_3.png" },
      { id: 4, phrase: "стирает слово", audio: "9_4.mp3", image: "9_4.png" },
    ],
  },
  {
    id: 10,
    phrases: [
      { id: 1, phrase: "красит стену", audio: "10_1.mp3", image: "10_1.png" },
      { id: 2, phrase: "печёт блины", audio: "10_2.mp3", image: "10_2.png" },
      { id: 3, phrase: "клеит обои", audio: "10_3.mp3", image: "10_3.png" },
      { id: 4, phrase: "красит волосы", audio: "10_4.mp3", image: "10_4.png" },
    ],
  },
  {
    id: 11,
    phrases: [
      { id: 1, phrase: "слушает маму", audio: "11_1.mp3", image: "11_1.png" },
      { id: 2, phrase: "кормит ребенка", audio: "11_2.mp3", image: "11_2.png" },
      { id: 3, phrase: "задаёт вопрос", audio: "11_3.mp3", image: "11_3.png" },
      { id: 4, phrase: "слушает музыку", audio: "11_4.mp3", image: "11_4.png" },
    ],
  },
  {
    id: 12,
    phrases: [
      { id: 1, phrase: "собирает малину", audio: "12_1.mp3", image: "12_1.png" },
      { id: 2, phrase: "чинит машину", audio: "12_2.mp3", image: "12_2.png" },
      { id: 3, phrase: "сажает картошку", audio: "12_3.mp3", image: "12_3.png" },
      { id: 4, phrase: "собирает мусор", audio: "12_4.mp3", image: "12_4.png" },
    ],
  },
  {
    id: 13,
    phrases: [
      { id: 1, phrase: "открывает банку", audio: "13_1.mp3", image: "13_1.png" },
      { id: 2, phrase: "сажает дерево", audio: "13_2.mp3", image: "13_2.png" },
      { id: 3, phrase: "закрывает замок", audio: "13_3.mp3", image: "13_3.png" },
      { id: 4, phrase: "открывает дверь", audio: "13_4.mp3", image: "13_4.png" },
    ],
  },
  {
    id: 14,
    phrases: [
      { id: 1, phrase: "вешает картинку", audio: "14_1.mp3", image: "14_1.png" },
      { id: 2, phrase: "дарит букет", audio: "14_2.mp3", image: "14_2.png" },
      { id: 3, phrase: "ставит вазу", audio: "14_3.mp3", image: "14_3.png" },
      { id: 4, phrase: "вешает пальто", audio: "14_4.mp3", image: "14_4.png" },
    ],
  },
  {
    id: 15,
    phrases: [
      { id: 1, phrase: "точит нож", audio: "15_1.mp3", image: "15_1.png" },
      { id: 2, phrase: "завязывает шнурки", audio: "15_2.mp3", image: "15_2.png" },
      { id: 3, phrase: "режет колбасу", audio: "15_3.mp3", image: "15_3.png" },
      { id: 4, phrase: "точит карандаш", audio: "15_4.mp3", image: "15_4.png" },
    ],
  },
];

export const verbNounTasks: VerbNounTask[] = RAW_TASKS.map((t) => ({
  id: t.id,
  phrases: t.phrases.map((p) => ({
    id: p.id,
    phrase: p.phrase,
    audioUrl: resolveAudio(p.audio),
    imageUrl: resolveImage(p.image),
  })) as [VerbNounPhrase, VerbNounPhrase, VerbNounPhrase, VerbNounPhrase],
}));
