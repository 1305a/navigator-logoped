import type { GenderItem, GenderTask } from "@/data/genderMasculineTrainer";

const imageModules = import.meta.glob("../assets/category-objects/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/category-objects/audio/*.mp3", {
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

export interface CategoryLevel {
  title: string;
  items: GenderItem[];
  tasks: GenderTask[];
}

const RAW_LEVELS = [
  {
    title: "Уровень 1 — продукты",
    items: [
      { id: 1, word: "яйцо", image: "1_1.png" },
      { id: 2, word: "рыба", image: "1_2.png" },
      { id: 3, word: "масло", image: "1_3.png" },
      { id: 4, word: "мороженое", image: "1_4.png" },
      { id: 5, word: "мясо", image: "1_5.png" },
      { id: 6, word: "хлеб", image: "1_6.png" },
    ],
    tasks: [
      { id: 1, instruction: "Покажите ЯЙЦО.", audio: "1_1.mp3", correctItemId: 1 },
      { id: 2, instruction: "Покажите РЫБУ.", audio: "1_2.mp3", correctItemId: 2 },
      { id: 3, instruction: "Покажите МАСЛО.", audio: "1_3.mp3", correctItemId: 3 },
      { id: 4, instruction: "Покажите МОРОЖЕНОЕ.", audio: "1_4.mp3", correctItemId: 4 },
      { id: 5, instruction: "Покажите МЯСО.", audio: "1_5.mp3", correctItemId: 5 },
      { id: 6, instruction: "Покажите ХЛЕБ.", audio: "1_6.mp3", correctItemId: 6 },
      { id: 7, instruction: "Найди парное?", audio: "1_7.mp3", correctItemId: 1 },
      { id: 8, instruction: "Найди ржаной?", audio: "1_8.mp3", correctItemId: 6 },
      { id: 9, instruction: "Найди морскую?", audio: "1_9.mp3", correctItemId: 2 },
      { id: 10, instruction: "Найди холодное?", audio: "1_10.mp3", correctItemId: 4 },
      { id: 11, instruction: "Найди куриное?", audio: "1_11.mp3", correctItemId: 1 },
      { id: 12, instruction: "Найди сливочное?", audio: "1_12.mp3", correctItemId: 3 },
      { id: 13, instruction: "Что варят?", audio: "1_13.mp3", correctItemId: 1 },
      { id: 14, instruction: "Что ловят?", audio: "1_14.mp3", correctItemId: 2 },
      { id: 15, instruction: "Что тает?", audio: "1_15.mp3", correctItemId: 4 },
      { id: 16, instruction: "Что выпекают?", audio: "1_16.mp3", correctItemId: 6 },
      { id: 17, instruction: "Что мажут?", audio: "1_17.mp3", correctItemId: 3 },
      { id: 18, instruction: "Что жарят?", audio: "1_18.mp3", correctItemId: 5 },
    ],
  },
  {
    title: "Уровень 2 — обувь",
    items: [
      { id: 1, word: "лапти", image: "2_1.png" },
      { id: 2, word: "ботинки", image: "2_2.png" },
      { id: 3, word: "пинетки", image: "2_3.png" },
      { id: 4, word: "туфли", image: "2_4.png" },
      { id: 5, word: "кроссовки", image: "2_5.png" },
      { id: 6, word: "сапоги", image: "2_6.png" },
    ],
    tasks: [
      { id: 1, instruction: "Покажите ЛАПТИ.", audio: "2_1.mp3", correctItemId: 1 },
      { id: 2, instruction: "Покажите БОТИНКИ.", audio: "2_2.mp3", correctItemId: 2 },
      { id: 3, instruction: "Покажите ПИНЕТКИ.", audio: "2_3.mp3", correctItemId: 3 },
      { id: 4, instruction: "Покажите ТУФЛИ.", audio: "2_4.mp3", correctItemId: 4 },
      { id: 5, instruction: "Покажите КРОССОВКИ.", audio: "2_5.mp3", correctItemId: 5 },
      { id: 6, instruction: "Покажите САПОГИ.", audio: "2_6.mp3", correctItemId: 6 },
      { id: 7, instruction: "Найди резиновые?", audio: "2_7.mp3", correctItemId: 6 },
      { id: 8, instruction: "Найди лакированные?", audio: "2_8.mp3", correctItemId: 4 },
      { id: 9, instruction: "Найди детские?", audio: "2_9.mp3", correctItemId: 3 },
      { id: 10, instruction: "Найди спортивные?", audio: "2_10.mp3", correctItemId: 5 },
      { id: 11, instruction: "Найди кожаные?", audio: "2_11.mp3", correctItemId: 2 },
      { id: 12, instruction: "Найди лыковые?", audio: "2_12.mp3", correctItemId: 1 },
      { id: 13, instruction: "Что вяжут?", audio: "2_13.mp3", correctItemId: 3 },
      { id: 14, instruction: "Что плетут?", audio: "2_14.mp3", correctItemId: 1 },
      { id: 15, instruction: "Во что наряжаются?", audio: "2_15.mp3", correctItemId: 4 },
      { id: 16, instruction: "Что не промокает?", audio: "2_16.mp3", correctItemId: 6 },
      { id: 17, instruction: "В чем бегают?", audio: "2_17.mp3", correctItemId: 5 },
      { id: 18, instruction: "Что носят?", audio: "2_18.mp3", correctItemId: 2 },
    ],
  },
  {
    title: "Уровень 3 — посуда",
    items: [
      { id: 1, word: "чайник", image: "3_1.png" },
      { id: 2, word: "ложка", image: "3_2.png" },
      { id: 3, word: "сковорода", image: "3_3.png" },
      { id: 4, word: "нож", image: "3_4.png" },
      { id: 5, word: "кастрюля", image: "3_5.png" },
      { id: 6, word: "стакан", image: "3_6.png" },
    ],
    tasks: [
      { id: 1, instruction: "Покажите ЧАЙНИК.", audio: "3_1.mp3", correctItemId: 1 },
      { id: 2, instruction: "Покажите ЛОЖКУ.", audio: "3_2.mp3", correctItemId: 2 },
      { id: 3, instruction: "Покажите СКОВОРОДУ.", audio: "3_3.mp3", correctItemId: 3 },
      { id: 4, instruction: "Покажите НОЖ.", audio: "3_4.mp3", correctItemId: 4 },
      { id: 5, instruction: "Покажите КАСТРЮЛЮ.", audio: "3_5.mp3", correctItemId: 5 },
      { id: 6, instruction: "Покажите СТАКАН.", audio: "3_6.mp3", correctItemId: 6 },
      { id: 7, instruction: "Найди чугунную?", audio: "3_7.mp3", correctItemId: 3 },
      { id: 8, instruction: "Найди электрический?", audio: "3_8.mp3", correctItemId: 1 },
      { id: 9, instruction: "Найди острый?", audio: "3_9.mp3", correctItemId: 4 },
      { id: 10, instruction: "Найди эмалированную?", audio: "3_10.mp3", correctItemId: 5 },
      { id: 11, instruction: "Найди стеклянный?", audio: "3_11.mp3", correctItemId: 6 },
      { id: 12, instruction: "Найди острый?", audio: "3_12.mp3", correctItemId: 4 },
      { id: 13, instruction: "В чем варят?", audio: "3_13.mp3", correctItemId: 5 },
      { id: 14, instruction: "Что кипятят?", audio: "3_14.mp3", correctItemId: 1 },
      { id: 15, instruction: "Из чего пьют?", audio: "3_15.mp3", correctItemId: 6 },
      { id: 16, instruction: "Чем режут?", audio: "3_16.mp3", correctItemId: 4 },
      { id: 17, instruction: "На чем жарят?", audio: "3_17.mp3", correctItemId: 3 },
      { id: 18, instruction: "Чем едят?", audio: "3_18.mp3", correctItemId: 2 },
    ],
  },
  {
    title: "Уровень 4 — мебель",
    items: [
      { id: 1, word: "шкаф", image: "4_1.png" },
      { id: 2, word: "полка", image: "4_2.png" },
      { id: 3, word: "стул", image: "4_3.png" },
      { id: 4, word: "стол", image: "4_4.png" },
      { id: 5, word: "кровать", image: "4_5.png" },
      { id: 6, word: "диван", image: "4_6.png" },
    ],
    tasks: [
      { id: 1, instruction: "Покажите ШКАФ.", audio: "4_1.mp3", correctItemId: 1 },
      { id: 2, instruction: "Покажите ПОЛКУ.", audio: "4_2.mp3", correctItemId: 2 },
      { id: 3, instruction: "Покажите СТУЛ.", audio: "4_3.mp3", correctItemId: 3 },
      { id: 4, instruction: "Покажите СТОЛ.", audio: "4_4.mp3", correctItemId: 4 },
      { id: 5, instruction: "Покажите КРОВАТЬ.", audio: "4_5.mp3", correctItemId: 5 },
      { id: 6, instruction: "Покажите ДИВАН.", audio: "4_6.mp3", correctItemId: 6 },
      { id: 7, instruction: "Найди двуспальную?", audio: "4_7.mp3", correctItemId: 5 },
      { id: 8, instruction: "Найди обеденный?", audio: "4_8.mp3", correctItemId: 4 },
      { id: 9, instruction: "Найди мягкий?", audio: "4_9.mp3", correctItemId: 6 },
      { id: 10, instruction: "Найди деревянный?", audio: "4_10.mp3", correctItemId: 3 },
      { id: 11, instruction: "Найди платяной?", audio: "4_11.mp3", correctItemId: 1 },
      { id: 12, instruction: "Найди книжную?", audio: "4_12.mp3", correctItemId: 2 },
      { id: 13, instruction: "Что вешают?", audio: "4_13.mp3", correctItemId: 1 },
      { id: 14, instruction: "На чем спят?", audio: "4_14.mp3", correctItemId: 5 },
      { id: 15, instruction: "На чем отдыхают?", audio: "4_15.mp3", correctItemId: 6 },
      { id: 16, instruction: "На чем сидят?", audio: "4_16.mp3", correctItemId: 3 },
      { id: 17, instruction: "Куда ставят книги?", audio: "4_17.mp3", correctItemId: 2 },
      { id: 18, instruction: "В чем хранят одежду?", audio: "4_18.mp3", correctItemId: 1 },
    ],
  },
  {
    title: "Уровень 5 — канцелярия",
    items: [
      { id: 1, word: "ручка", image: "5_1.png" },
      { id: 2, word: "циркуль", image: "5_2.png" },
      { id: 3, word: "краски", image: "5_3.png" },
      { id: 4, word: "карандаши", image: "5_4.png" },
      { id: 5, word: "линейка", image: "5_5.png" },
      { id: 6, word: "ластик", image: "5_6.png" },
    ],
    tasks: [
      { id: 1, instruction: "Покажите РУЧКУ.", audio: "5_1.mp3", correctItemId: 1 },
      { id: 2, instruction: "Покажите ЦИРКУЛЬ.", audio: "5_2.mp3", correctItemId: 2 },
      { id: 3, instruction: "Покажите КРАСКИ.", audio: "5_3.mp3", correctItemId: 3 },
      { id: 4, instruction: "Покажите КАРАНДАШИ.", audio: "5_4.mp3", correctItemId: 4 },
      { id: 5, instruction: "Покажите ЛИНЕЙКУ.", audio: "5_5.mp3", correctItemId: 5 },
      { id: 6, instruction: "Покажите ЛАСТИК.", audio: "5_6.mp3", correctItemId: 6 },
      { id: 7, instruction: "Найди металлический?", audio: "5_7.mp3", correctItemId: 2 },
      { id: 8, instruction: "Найди акварельные?", audio: "5_8.mp3", correctItemId: 3 },
      { id: 9, instruction: "Найди пластмассовую?", audio: "5_9.mp3", correctItemId: 5 },
      { id: 10, instruction: "Найди цветные?", audio: "5_10.mp3", correctItemId: 4 },
      { id: 11, instruction: "Найди резиновую?", audio: "5_11.mp3", correctItemId: 6 },
      { id: 12, instruction: "Найди шариковую?", audio: "5_12.mp3", correctItemId: 1 },
      { id: 13, instruction: "Чем пишут?", audio: "5_13.mp3", correctItemId: 1 },
      { id: 14, instruction: "Чем чертят?", audio: "5_14.mp3", correctItemId: 2 },
      { id: 15, instruction: "Чем рисуют?", audio: "5_15.mp3", correctItemId: 3 },
      { id: 16, instruction: "Что стирают?", audio: "5_16.mp3", correctItemId: 6 },
      { id: 17, instruction: "Что измеряют?", audio: "5_17.mp3", correctItemId: 5 },
      { id: 18, instruction: "Чем красят?", audio: "5_18.mp3", correctItemId: 4 },
    ],
  },
];

export const categoryObjectLevels: CategoryLevel[] = RAW_LEVELS.map((lvl) => ({
  title: lvl.title,
  items: lvl.items.map((i) => ({ id: i.id, word: i.word, imageUrl: resolveImage(i.image) })),
  tasks: lvl.tasks.map((t) => ({
    id: t.id,
    instruction: t.instruction,
    audioUrl: resolveAudio(t.audio),
    correctItemId: t.correctItemId,
  })),
}));
