export interface ComposePhraseWord {
  word: string;
  question: string;
}

export interface ComposePhrase {
  id: number;
  phrase: string;
  imageUrl?: string;
  words: [ComposePhraseWord, ComposePhraseWord, ComposePhraseWord];
}

const imageModules = import.meta.glob("../assets/compose-phrase/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(fileName: string): string | undefined {
  const key = Object.keys(imageModules).find((k) => k.endsWith(`/${fileName}`));
  return key ? imageModules[key] : undefined;
}

type RawWord = { word: string; question: string };
type RawPhrase = { id: number; phrase: string; image: string; words: [RawWord, RawWord, RawWord] };

const RAW_GROUPS: RawPhrase[][] = [
  [
    { id: 1, phrase: "Мальчик кормит рыбок", image: "1.png", words: [{ word: "мальчик", question: "Кто?" }, { word: "кормит", question: "Что делает?" }, { word: "рыбок", question: "Кого?" }] },
    { id: 2, phrase: "Доярка доит корову", image: "2.png", words: [{ word: "доярка", question: "Кто?" }, { word: "доит", question: "Что делает?" }, { word: "корову", question: "Кого?" }] },
    { id: 3, phrase: "Девочка гладит кошку", image: "3.png", words: [{ word: "девочка", question: "Кто?" }, { word: "гладит", question: "Что делает?" }, { word: "кошку", question: "Кого?" }] },
    { id: 4, phrase: "Мама купает малыша", image: "4.png", words: [{ word: "мама", question: "Кто?" }, { word: "купает", question: "Что делает?" }, { word: "малыша", question: "Кого?" }] },
  ],
  [
    { id: 5, phrase: "Курица клюёт зерно", image: "5.png", words: [{ word: "курица", question: "Кто?" }, { word: "клюёт", question: "Что делает?" }, { word: "зерно", question: "Что?" }] },
    { id: 6, phrase: "Именинница задувает свечи", image: "6.png", words: [{ word: "именинница", question: "Кто?" }, { word: "задувает", question: "Что делает?" }, { word: "свечи", question: "Что?" }] },
    { id: 7, phrase: "Бабушка солит огурцы", image: "7.png", words: [{ word: "бабушка", question: "Кто?" }, { word: "солит", question: "Что делает?" }, { word: "огурцы", question: "Что?" }] },
    { id: 8, phrase: "Электрик меняет лампочку", image: "8.png", words: [{ word: "электрик", question: "Кто?" }, { word: "меняет", question: "Что делает?" }, { word: "лампочку", question: "Что?" }] },
  ],
  [
    { id: 9, phrase: "Трактор пашет поле", image: "9.png", words: [{ word: "трактор", question: "Что?" }, { word: "пашет", question: "Что делает?" }, { word: "поле", question: "Что?" }] },
    { id: 10, phrase: "Тучи затягивают небо", image: "10.png", words: [{ word: "тучи", question: "Что?" }, { word: "затягивают", question: "Что делают?" }, { word: "небо", question: "Что?" }] },
    { id: 11, phrase: "Экскаватор роет землю", image: "11.png", words: [{ word: "экскаватор", question: "Что?" }, { word: "роет", question: "Что делает?" }, { word: "землю", question: "Что?" }] },
    { id: 12, phrase: "Комбайн убирает зерно", image: "12.png", words: [{ word: "комбайн", question: "Что?" }, { word: "убирает", question: "Что делает?" }, { word: "зерно", question: "Что?" }] },
  ],
  [
    { id: 13, phrase: "Дворник гребёт листву", image: "13.png", words: [{ word: "дворник", question: "Кто?" }, { word: "гребёт", question: "Что делает?" }, { word: "листву", question: "Что?" }] },
    { id: 14, phrase: "Мальчик кидает камешки", image: "14.png", words: [{ word: "мальчик", question: "Кто?" }, { word: "кидает", question: "Что делает?" }, { word: "камешки", question: "Что?" }] },
    { id: 15, phrase: "Атлет поднимает штангу", image: "15.png", words: [{ word: "атлет", question: "Кто?" }, { word: "поднимает", question: "Что делает?" }, { word: "штангу", question: "Что?" }] },
    { id: 16, phrase: "Девушка крутит обруч", image: "16.png", words: [{ word: "девушка", question: "Кто?" }, { word: "крутит", question: "Что делает?" }, { word: "обруч", question: "Что?" }] },
  ],
  [
    { id: 17, phrase: "Туристы разводят костёр", image: "17.png", words: [{ word: "туристы", question: "Кто?" }, { word: "разводят", question: "Что делают?" }, { word: "костёр", question: "Что?" }] },
    { id: 18, phrase: "Студенты слушают лекцию", image: "18.png", words: [{ word: "студенты", question: "Кто?" }, { word: "слушают", question: "Что делают?" }, { word: "лекцию", question: "Что?" }] },
    { id: 19, phrase: "Строители строят дом", image: "19.png", words: [{ word: "строители", question: "Кто?" }, { word: "строят", question: "Что делают?" }, { word: "дом", question: "Что?" }] },
    { id: 20, phrase: "Рабочие клеят обои", image: "20.png", words: [{ word: "рабочие", question: "Кто?" }, { word: "клеят", question: "Что делают?" }, { word: "обои", question: "Что?" }] },
  ],
  [
    { id: 21, phrase: "Пастух пасёт стадо", image: "21.png", words: [{ word: "пастух", question: "Кто?" }, { word: "пасёт", question: "Что делает?" }, { word: "стадо", question: "Что?" }] },
    { id: 22, phrase: "Фермер убирает урожай", image: "22.png", words: [{ word: "фермер", question: "Кто?" }, { word: "убирает", question: "Что делает?" }, { word: "урожай", question: "Что?" }] },
    { id: 23, phrase: "Девочка ловит бабочку", image: "23.png", words: [{ word: "девочка", question: "Кто?" }, { word: "ловит", question: "Что делает?" }, { word: "бабочку", question: "Кого?" }] },
    { id: 24, phrase: "Библиотекарь выдаёт книги", image: "24.png", words: [{ word: "библиотекарь", question: "Кто?" }, { word: "выдаёт", question: "Что делает?" }, { word: "книги", question: "Что?" }] },
  ],
  [
    { id: 25, phrase: "Курьер доставляет заказ", image: "25.png", words: [{ word: "курьер", question: "Кто?" }, { word: "доставляет", question: "Что делает?" }, { word: "заказ", question: "Что?" }] },
    { id: 26, phrase: "Пешеход переходит улицу", image: "26.png", words: [{ word: "пешеход", question: "Кто?" }, { word: "переходит", question: "Что делает?" }, { word: "улицу", question: "Что?" }] },
    { id: 27, phrase: "Уборщица моет пол", image: "27.png", words: [{ word: "уборщица", question: "Кто?" }, { word: "моет", question: "Что делает?" }, { word: "пол", question: "Что?" }] },
    { id: 28, phrase: "Кошка ловит мышку", image: "28.png", words: [{ word: "кошка", question: "Кто?" }, { word: "ловит", question: "Что делает?" }, { word: "мышку", question: "Кого?" }] },
  ],
  [
    { id: 29, phrase: "Женщина пришивает пуговицу", image: "29.png", words: [{ word: "женщина", question: "Кто?" }, { word: "пришивает", question: "Что делает?" }, { word: "пуговицу", question: "Что?" }] },
    { id: 30, phrase: "Медсестра перевязывает руку", image: "30.png", words: [{ word: "медсестра", question: "Кто?" }, { word: "перевязывает", question: "Что делает?" }, { word: "руку", question: "Что?" }] },
    { id: 31, phrase: "Муравей тащит соломинку", image: "31.png", words: [{ word: "муравей", question: "Кто?" }, { word: "тащит", question: "Что делает?" }, { word: "соломинку", question: "Что?" }] },
    { id: 32, phrase: "Женщина красит губы", image: "32.png", words: [{ word: "женщина", question: "Кто?" }, { word: "красит", question: "Что делает?" }, { word: "губы", question: "Что?" }] },
  ],
  [
    { id: 33, phrase: "Мальчик везёт санки", image: "33.png", words: [{ word: "мальчик", question: "Кто?" }, { word: "везёт", question: "Что делает?" }, { word: "санки", question: "Что?" }] },
    { id: 34, phrase: "Альпинист покоряет вершину", image: "34.png", words: [{ word: "альпинист", question: "Кто?" }, { word: "покоряет", question: "Что делает?" }, { word: "вершину", question: "Что?" }] },
    { id: 35, phrase: "Хозяйка моет окно", image: "35.png", words: [{ word: "хозяйка", question: "Кто?" }, { word: "моет", question: "Что делает?" }, { word: "окно", question: "Что?" }] },
    { id: 36, phrase: "Слон несёт бревно", image: "36.png", words: [{ word: "слон", question: "Кто?" }, { word: "несёт", question: "Что делает?" }, { word: "бревно", question: "Что?" }] },
  ],
  [
    { id: 37, phrase: "Юноша дарит подарок", image: "37.png", words: [{ word: "юноша", question: "Кто?" }, { word: "дарит", question: "Что делает?" }, { word: "подарок", question: "Что?" }] },
    { id: 38, phrase: "Портной шьёт брюки", image: "38.png", words: [{ word: "портной", question: "Кто?" }, { word: "шьёт", question: "Что делает?" }, { word: "брюки", question: "Что?" }] },
    { id: 39, phrase: "Девушка примеряет платье", image: "39.png", words: [{ word: "девушка", question: "Кто?" }, { word: "примеряет", question: "Что делает?" }, { word: "платье", question: "Что?" }] },
    { id: 40, phrase: "Больной пьёт лекарство", image: "40.png", words: [{ word: "больной", question: "Кто?" }, { word: "пьёт", question: "Что делает?" }, { word: "лекарство", question: "Что?" }] },
  ],
  [
    { id: 41, phrase: "Дети наряжают ёлку", image: "41.png", words: [{ word: "дети", question: "Кто?" }, { word: "наряжают", question: "Что делают?" }, { word: "ёлку", question: "Что?" }] },
    { id: 42, phrase: "Ребята смотрят кино", image: "42.png", words: [{ word: "ребята", question: "Кто?" }, { word: "смотрят", question: "Что делают?" }, { word: "кино", question: "Что?" }] },
    { id: 43, phrase: "Туристы ставят палатку", image: "43.png", words: [{ word: "туристы", question: "Кто?" }, { word: "ставят", question: "Что делают?" }, { word: "палатку", question: "Что?" }] },
    { id: 44, phrase: "Рыбаки тянут сеть", image: "44.png", words: [{ word: "рыбаки", question: "Кто?" }, { word: "тянут", question: "Что делают?" }, { word: "сеть", question: "Что?" }] },
  ],
  [
    { id: 45, phrase: "Футболист получает кубок", image: "45.png", words: [{ word: "футболист", question: "Кто?" }, { word: "получает", question: "Что делает?" }, { word: "кубок", question: "Что?" }] },
    { id: 46, phrase: "Женщина разрезает торт", image: "46.png", words: [{ word: "женщина", question: "Кто?" }, { word: "разрезает", question: "Что делает?" }, { word: "торт", question: "Что?" }] },
    { id: 47, phrase: "Пчела собирает нектар", image: "47.png", words: [{ word: "пчела", question: "Кто?" }, { word: "собирает", question: "Что делает?" }, { word: "нектар", question: "Что?" }] },
    { id: 48, phrase: "Пассажир покупает билет", image: "48.png", words: [{ word: "пассажир", question: "Кто?" }, { word: "покупает", question: "Что делает?" }, { word: "билет", question: "Что?" }] },
  ],
  [
    { id: 49, phrase: "Мужчина надувает матрас", image: "49.png", words: [{ word: "мужчина", question: "Кто?" }, { word: "надувает", question: "Что делает?" }, { word: "матрас", question: "Что?" }] },
    { id: 50, phrase: "Повар печёт блины", image: "50.png", words: [{ word: "повар", question: "Кто?" }, { word: "печёт", question: "Что делает?" }, { word: "блины", question: "Что?" }] },
    { id: 51, phrase: "Корова жуёт траву", image: "51.png", words: [{ word: "корова", question: "Кто?" }, { word: "жуёт", question: "Что делает?" }, { word: "траву", question: "Что?" }] },
    { id: 52, phrase: "Девочка пьёт лимонад", image: "52.png", words: [{ word: "девочка", question: "Кто?" }, { word: "пьёт", question: "Что делает?" }, { word: "лимонад", question: "Что?" }] },
  ],
  [
    { id: 53, phrase: "Продавец продаёт фрукты", image: "53.png", words: [{ word: "продавец", question: "Кто?" }, { word: "продаёт", question: "Что делает?" }, { word: "фрукты", question: "Что?" }] },
    { id: 54, phrase: "Садовник срезает цветок", image: "54.png", words: [{ word: "садовник", question: "Кто?" }, { word: "срезает", question: "Что делает?" }, { word: "цветок", question: "Что?" }] },
    { id: 55, phrase: "Химик проводит опыт", image: "55.png", words: [{ word: "химик", question: "Кто?" }, { word: "проводит", question: "Что делает?" }, { word: "опыт", question: "Что?" }] },
    { id: 56, phrase: "Солдат держит ружьё", image: "56.png", words: [{ word: "солдат", question: "Кто?" }, { word: "держит", question: "Что делает?" }, { word: "ружьё", question: "Что?" }] },
  ],
  [
    { id: 57, phrase: "Ласточка кормит птенца", image: "57.png", words: [{ word: "ласточка", question: "Кто?" }, { word: "кормит", question: "Что делает?" }, { word: "птенца", question: "Кого?" }] },
    { id: 58, phrase: "Конюх седлает лошадь", image: "58.png", words: [{ word: "конюх", question: "Кто?" }, { word: "седлает", question: "Что делает?" }, { word: "лошадь", question: "Кого?" }] },
    { id: 59, phrase: "Хозяин выгуливает собаку", image: "59.png", words: [{ word: "хозяин", question: "Кто?" }, { word: "выгуливает", question: "Что делает?" }, { word: "собаку", question: "Кого?" }] },
    { id: 60, phrase: "Мама укачивает ребёнка", image: "60.png", words: [{ word: "мама", question: "Кто?" }, { word: "укачивает", question: "Что делает?" }, { word: "ребёнка", question: "Кого?" }] },
  ],
  [
    { id: 61, phrase: "Сапожник чинит сапоги", image: "61.png", words: [{ word: "сапожник", question: "Кто?" }, { word: "чинит", question: "Что делает?" }, { word: "сапоги", question: "Что?" }] },
    { id: 62, phrase: "Инспектор останавливает машину", image: "62.png", words: [{ word: "инспектор", question: "Кто?" }, { word: "останавливает", question: "Что делает?" }, { word: "машину", question: "Что?" }] },
    { id: 63, phrase: "Жюри оценивает соревнование", image: "63.png", words: [{ word: "жюри", question: "Кто?" }, { word: "оценивает", question: "Что делает?" }, { word: "соревнование", question: "Что?" }] },
    { id: 64, phrase: "Шахтёр добывает уголь", image: "64.png", words: [{ word: "шахтёр", question: "Кто?" }, { word: "добывает", question: "Что делает?" }, { word: "уголь", question: "Что?" }] },
  ],
  [
    { id: 65, phrase: "Слесарь чинит машину", image: "65.png", words: [{ word: "слесарь", question: "Кто?" }, { word: "чинит", question: "Что делает?" }, { word: "машину", question: "Что?" }] },
    { id: 66, phrase: "Официант подаёт кофе", image: "66.png", words: [{ word: "официант", question: "Кто?" }, { word: "подаёт", question: "Что делает?" }, { word: "кофе", question: "Что?" }] },
    { id: 67, phrase: "Мальчик слушает музыку", image: "67.png", words: [{ word: "мальчик", question: "Кто?" }, { word: "слушает", question: "Что делает?" }, { word: "музыку", question: "Что?" }] },
    { id: 68, phrase: "Мужчина принимает душ", image: "68.png", words: [{ word: "мужчина", question: "Кто?" }, { word: "принимает", question: "Что делает?" }, { word: "душ", question: "Что?" }] },
  ],
];

export interface ComposePhraseTask {
  id: number;
  phrases: ComposePhrase[];
}

export const composePhraseTasks: ComposePhraseTask[] = RAW_GROUPS.map((group, idx) => ({
  id: idx + 1,
  phrases: group.map((p) => ({
    id: p.id,
    phrase: p.phrase,
    imageUrl: resolveImage(p.image),
    words: p.words,
  })),
}));

export function phraseCountForLevel(level: number): number {
  return level + 2;
}
