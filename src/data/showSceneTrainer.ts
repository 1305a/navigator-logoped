export interface ShowSceneRow {
  id: number;
  phrase: string;
  imageUrl?: string;
  audioUrl?: string;
  distractors: [ColumnAsset, ColumnAsset, ColumnAsset];
}

interface ColumnAsset {
  phrase: string;
  imageUrl?: string;
  audioUrl?: string;
}

const imageModules = import.meta.glob("../assets/show-scene/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/show-scene/audio/*.mp3", {
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

type ColEntry = { id: number; phrase: string; image: string; audio: string };

const COL1: ColEntry[] = [
  { id: 1, phrase: "Дворник подметает улицу", image: "1_1.png", audio: "1_1.mp3" },
  { id: 2, phrase: "Бабушка печёт пироги", image: "1_2.png", audio: "1_2.mp3" },
  { id: 3, phrase: "Художник рисует картину", image: "1_3.png", audio: "1_3.mp3" },
  { id: 4, phrase: "Повар чистит картошку", image: "1_4.png", audio: "1_4.mp3" },
  { id: 5, phrase: "Парикмахер стрижет волосы", image: "1_5.png", audio: "1_5.mp3" },
  { id: 6, phrase: "Мама кормит сына", image: "1_6.png", audio: "1_6.mp3" },
  { id: 7, phrase: "Девочка читает книгу", image: "1_7.png", audio: "1_7.mp3" },
  { id: 8, phrase: "Хозяйка доит корову", image: "1_8.png", audio: "1_8.mp3" },
  { id: 9, phrase: "Дачник поливает цветы", image: "1_9.png", audio: "1_9.mp3" },
  { id: 10, phrase: "Кошка пьёт молоко", image: "1_10.png", audio: "1_10.mp3" },
  { id: 11, phrase: "Собака грызет кость", image: "1_11.png", audio: "1_11.mp3" },
  { id: 12, phrase: "Врач лечит зубы", image: "1_12.png", audio: "1_12.mp3" },
  { id: 13, phrase: "Футболист забивает гол", image: "1_13.png", audio: "1_13.mp3" },
  { id: 14, phrase: "Хозяйка гладит бельё", image: "1_14.png", audio: "1_14.mp3" },
  { id: 15, phrase: "Пожарный тушит огонь", image: "1_15.png", audio: "1_15.mp3" },
  { id: 16, phrase: "Учитель учит детей", image: "1_16.png", audio: "1_16.mp3" },
];

const COL2: ColEntry[] = [
  { id: 1, phrase: "Грибник собирает грибы", image: "2_1.png", audio: "2_1.mp3" },
  { id: 2, phrase: "Шахтер добывает уголь", image: "2_2.png", audio: "2_2.mp3" },
  { id: 3, phrase: "Портной снимает мерки", image: "2_3.png", audio: "2_3.mp3" },
  { id: 4, phrase: "Мама покупает овощи", image: "2_4.png", audio: "2_4.mp3" },
  { id: 5, phrase: "Ученик решает задачу", image: "2_5.png", audio: "2_5.mp3" },
  { id: 6, phrase: "Мужчина несёт портфель", image: "2_6.png", audio: "2_6.mp3" },
  { id: 7, phrase: "Мальчик чистит зубы", image: "2_7.png", audio: "2_7.mp3" },
  { id: 8, phrase: "Мальчик ест мороженое", image: "2_8.png", audio: "2_8.mp3" },
  { id: 9, phrase: "Рыбак варит уху", image: "2_9.png", audio: "2_9.mp3" },
  { id: 10, phrase: "Девочка делает зарядку", image: "2_10.png", audio: "2_10.mp3" },
  { id: 11, phrase: "Птица вьёт гнездо", image: "2_11.png", audio: "2_11.mp3" },
  { id: 12, phrase: "Мальчик надевает валенки", image: "2_12.png", audio: "2_12.mp3" },
  { id: 13, phrase: "Бабушка зажигает свечу", image: "2_13.png", audio: "2_13.mp3" },
  { id: 14, phrase: "Мужчина везёт тележку", image: "2_14.png", audio: "2_14.mp3" },
  { id: 15, phrase: "Девушка покупает журнал", image: "2_15.png", audio: "2_15.mp3" },
  { id: 16, phrase: "Бабушка варит варенье", image: "2_16.png", audio: "2_16.mp3" },
];

const COL3: ColEntry[] = [
  { id: 1, phrase: "Дворник собирает листья", image: "3_1.png", audio: "3_1.mp3" },
  { id: 2, phrase: "Бабушка поливает цветы", image: "3_2.png", audio: "3_2.mp3" },
  { id: 3, phrase: "Художник ставит мольберт", image: "3_3.png", audio: "3_3.mp3" },
  { id: 4, phrase: "Повар режет салат", image: "3_4.png", audio: "3_4.mp3" },
  { id: 5, phrase: "Парикмахер делает прическу", image: "3_5.png", audio: "3_5.mp3" },
  { id: 6, phrase: "Мама моет посуду", image: "3_6.png", audio: "3_6.mp3" },
  { id: 7, phrase: "Девочка пришивает пуговицу", image: "3_7.png", audio: "3_7.mp3" },
  { id: 8, phrase: "Хозяйка моет окно", image: "3_8.png", audio: "3_8.mp3" },
  { id: 9, phrase: "Дачник копает картошку", image: "3_9.png", audio: "3_9.mp3" },
  { id: 10, phrase: "Кошка несёт сосиски", image: "3_10.png", audio: "3_10.mp3" },
  { id: 11, phrase: "Собака роет яму", image: "3_11.png", audio: "3_11.mp3" },
  { id: 12, phrase: "Врач измеряет давление", image: "3_12.png", audio: "3_12.mp3" },
  { id: 13, phrase: "Футболист держит кубок", image: "3_13.png", audio: "3_13.mp3" },
  { id: 14, phrase: "Хозяйка вытирает пыль", image: "3_14.png", audio: "3_14.mp3" },
  { id: 15, phrase: "Пожарный спасает человека", image: "3_15.png", audio: "3_15.mp3" },
  { id: 16, phrase: "Учитель ставит оценку", image: "3_16.png", audio: "3_16.mp3" },
];

const COL4: ColEntry[] = [
  { id: 1, phrase: "Женщина подметает ковер", image: "4_1.png", audio: "4_1.mp3" },
  { id: 2, phrase: "Повар печет блины", image: "4_2.png", audio: "4_2.mp3" },
  { id: 3, phrase: "Мальчик рисует солнце", image: "4_3.png", audio: "4_3.mp3" },
  { id: 4, phrase: "Сапожник чистит сапоги", image: "4_4.png", audio: "4_4.mp3" },
  { id: 5, phrase: "Мастер стрижет пуделя", image: "4_5.png", audio: "4_5.mp3" },
  { id: 6, phrase: "Работница кормит уток", image: "4_6.png", audio: "4_6.mp3" },
  { id: 7, phrase: "Мужчина читает газету", image: "4_7.png", audio: "4_7.mp3" },
  { id: 8, phrase: "Девушка доит козу", image: "4_8.png", audio: "4_8.mp3" },
  { id: 9, phrase: "Дворник поливает дерево", image: "4_9.png", audio: "4_9.mp3" },
  { id: 10, phrase: "Дедушка пьет кефир", image: "4_10.png", audio: "4_10.mp3" },
  { id: 11, phrase: "Белка грызет орех", image: "4_11.png", audio: "4_11.mp3" },
  { id: 12, phrase: "Ветеринар лечит собаку", image: "4_12.png", audio: "4_12.mp3" },
  { id: 13, phrase: "Мальчик забивает гвоздь", image: "4_13.png", audio: "4_13.mp3" },
  { id: 14, phrase: "Ребенок гладит кошку", image: "4_14.png", audio: "4_14.mp3" },
  { id: 15, phrase: "Мама тушит овощи", image: "4_15.png", audio: "4_15.mp3" },
  { id: 16, phrase: "Ученик учит стих", image: "4_16.png", audio: "4_16.mp3" },
];

function buildColumnAsset(e: ColEntry): ColumnAsset {
  return { phrase: e.phrase, imageUrl: resolveImage(e.image), audioUrl: resolveAudio(e.audio) };
}

export const showSceneRows: ShowSceneRow[] = COL1.map((c1) => {
  const c2 = COL2.find((r) => r.id === c1.id)!;
  const c3 = COL3.find((r) => r.id === c1.id)!;
  const c4 = COL4.find((r) => r.id === c1.id)!;
  return {
    id: c1.id,
    phrase: c1.phrase,
    imageUrl: resolveImage(c1.image),
    audioUrl: resolveAudio(c1.audio),
    distractors: [buildColumnAsset(c2), buildColumnAsset(c3), buildColumnAsset(c4)],
  };
});
