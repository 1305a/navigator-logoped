export interface EndingPhrase {
  id: string;
  before: string;
  correctEnding: string;
  after: string;
}

export interface EndingTask {
  id: number;
  phrases: EndingPhrase[];
}

type RawPhrase = { id: number; phrase: string; ending: string };
type RawTask = { id: number; phrases: RawPhrase[] };

function splitPhraseWithBlank(raw: string): { before: string; after: string } {
  const parts = raw.split("_");
  const before = (parts[0] ?? "").trimEnd();
  const after = parts.slice(1).join("_").trimStart();
  return { before, after };
}

const RAW_TASKS: RawTask[] = [
  { id: 1, phrases: [
    { id: 1, phrase: "детск_ сад", ending: "ий" },
    { id: 2, phrase: "детск_ библиотека", ending: "ая" },
    { id: 3, phrase: "детск_ питание", ending: "ое" },
    { id: 4, phrase: "детск_ игрушки", ending: "ие" },
  ] },
  { id: 2, phrases: [
    { id: 1, phrase: "жарен_ гусь", ending: "ый" },
    { id: 2, phrase: "жарен_ картошка", ending: "ая" },
    { id: 3, phrase: "жарен_ мясо", ending: "ое" },
    { id: 4, phrase: "жарен_ котлеты", ending: "ые" },
  ] },
  { id: 3, phrases: [
    { id: 1, phrase: "стеклянн_ стакан", ending: "ый" },
    { id: 2, phrase: "стеклянн_ ваза", ending: "ая" },
    { id: 3, phrase: "стеклянн_ блюдо", ending: "ое" },
    { id: 4, phrase: "стеклянн_ окна", ending: "ые" },
  ] },
  { id: 4, phrases: [
    { id: 1, phrase: "цветочн_ базар", ending: "ый" },
    { id: 2, phrase: "цветочн_ оранжерея", ending: "ая" },
    { id: 3, phrase: "цветочн_ мыло", ending: "ое" },
    { id: 4, phrase: "цветочн_ клумбы", ending: "ые" },
  ] },
  { id: 5, phrases: [
    { id: 1, phrase: "пушист_ хвост", ending: "ый" },
    { id: 2, phrase: "пушист_ шапка", ending: "ая" },
    { id: 3, phrase: "пушист_ одеяло", ending: "ое" },
    { id: 4, phrase: "пушист_ волосы", ending: "ые" },
  ] },
  { id: 6, phrases: [
    { id: 1, phrase: "деревянн_ дом", ending: "ый" },
    { id: 2, phrase: "деревянн_ лошадка", ending: "ая" },
    { id: 3, phrase: "деревянн_ коромысло", ending: "ое" },
    { id: 4, phrase: "деревянн_ стулья", ending: "ые" },
  ] },
  { id: 7, phrases: [
    { id: 1, phrase: "фруктов_ сад", ending: "ый" },
    { id: 2, phrase: "фруктов_ начинка", ending: "ая" },
    { id: 3, phrase: "фруктов_ варенье", ending: "ое" },
    { id: 4, phrase: "фруктов_ деревья", ending: "ые" },
  ] },
  { id: 8, phrases: [
    { id: 1, phrase: "утренн_ кофе", ending: "ий" },
    { id: 2, phrase: "утренн_ роса", ending: "яя" },
    { id: 3, phrase: "утренн_ заседание", ending: "ее" },
    { id: 4, phrase: "утренн_ таблетки", ending: "ие" },
  ] },
  { id: 9, phrases: [
    { id: 1, phrase: "железн_ гвоздь", ending: "ый" },
    { id: 2, phrase: "железн_ ложка", ending: "ая" },
    { id: 3, phrase: "железн_ ведро", ending: "ое" },
    { id: 4, phrase: "железн_ нервы", ending: "ые" },
  ] },
  { id: 10, phrases: [
    { id: 1, phrase: "каменн_ мост", ending: "ый" },
    { id: 2, phrase: "каменн_ стена", ending: "ая" },
    { id: 3, phrase: "каменн_ лицо", ending: "ое" },
    { id: 4, phrase: "каменн_ столбы", ending: "ые" },
  ] },
  { id: 11, phrases: [
    { id: 1, phrase: "овощн_ салат", ending: "ой" },
    { id: 2, phrase: "овощн_ лавка", ending: "ая" },
    { id: 3, phrase: "овощн_ рагу", ending: "ое" },
    { id: 4, phrase: "овощн_ консервы", ending: "ые" },
  ] },
  { id: 12, phrases: [
    { id: 1, phrase: "чист_ воздух", ending: "ый" },
    { id: 2, phrase: "чист_ вода", ending: "ая" },
    { id: 3, phrase: "чист_ бельё", ending: "ое" },
    { id: 4, phrase: "чист_ руки", ending: "ые" },
  ] },
  { id: 13, phrases: [
    { id: 1, phrase: "кухонн_ гарнитур", ending: "ый" },
    { id: 2, phrase: "кухонн_ посуда", ending: "ая" },
    { id: 3, phrase: "кухонн_ полотенце", ending: "ое" },
    { id: 4, phrase: "кухонн_ табуретки", ending: "ые" },
  ] },
  { id: 14, phrases: [
    { id: 1, phrase: "солнечн_ ожог", ending: "ый" },
    { id: 2, phrase: "солнечн_ энергия", ending: "ая" },
    { id: 3, phrase: "солнечн_ утро", ending: "ое" },
    { id: 4, phrase: "солнечн_ зайчики", ending: "ые" },
  ] },
  { id: 15, phrases: [
    { id: 1, phrase: "светл_ день", ending: "ый" },
    { id: 2, phrase: "светл_ полоса", ending: "ая" },
    { id: 3, phrase: "светл_ платье", ending: "ое" },
    { id: 4, phrase: "светл_ волосы", ending: "ые" },
  ] },
  { id: 16, phrases: [
    { id: 1, phrase: "открыт_ вход", ending: "ый" },
    { id: 2, phrase: "открыт_ дверь", ending: "ая" },
    { id: 3, phrase: "открыт_ окно", ending: "ое" },
    { id: 4, phrase: "открыт_ занятия", ending: "ые" },
  ] },
  { id: 17, phrases: [
    { id: 1, phrase: "любим_ напиток", ending: "ый" },
    { id: 2, phrase: "любим_ книга", ending: "ая" },
    { id: 3, phrase: "любим_ блюдо", ending: "ое" },
    { id: 4, phrase: "любим_ фильмы", ending: "ые" },
  ] },
  { id: 18, phrases: [
    { id: 1, phrase: "комнатн_ цветок", ending: "ый" },
    { id: 2, phrase: "комнатн_ перегородка", ending: "ая" },
    { id: 3, phrase: "комнатн_ окно", ending: "ое" },
    { id: 4, phrase: "комнатн_ растение", ending: "ые" },
  ] },
  { id: 19, phrases: [
    { id: 1, phrase: "печальн_ взгляд", ending: "ый" },
    { id: 2, phrase: "печальн_ история", ending: "ая" },
    { id: 3, phrase: "печальн_ лицо", ending: "ое" },
    { id: 4, phrase: "печальн_ события", ending: "ые" },
  ] },
  { id: 20, phrases: [
    { id: 1, phrase: "крупн_ начальник", ending: "ый" },
    { id: 2, phrase: "крупн_ купюра", ending: "ая" },
    { id: 3, phrase: "крупн_ тело", ending: "ое" },
    { id: 4, phrase: "крупн_ яблоки", ending: "ые" },
  ] },
  { id: 21, phrases: [
    { id: 1, phrase: "нов_ сосед", ending: "ый" },
    { id: 2, phrase: "нов_ станция", ending: "ая" },
    { id: 3, phrase: "нов_ предприятие", ending: "ое" },
    { id: 4, phrase: "нов_ вещи", ending: "ые" },
  ] },
  { id: 22, phrases: [
    { id: 1, phrase: "музыкальн_ концерт", ending: "ый" },
    { id: 2, phrase: "музыкальн_ программа", ending: "ая" },
    { id: 3, phrase: "музыкальн_ образование", ending: "ое" },
    { id: 4, phrase: "музыкальн_ инструменты", ending: "ые" },
  ] },
  { id: 23, phrases: [
    { id: 1, phrase: "литературн_ клуб", ending: "ый" },
    { id: 2, phrase: "литературн_ передача", ending: "ая" },
    { id: 3, phrase: "литературн_ произведение", ending: "ое" },
    { id: 4, phrase: "литературн_ вечера", ending: "ые" },
  ] },
  { id: 24, phrases: [
    { id: 1, phrase: "прям_ путь", ending: "ой" },
    { id: 2, phrase: "прям_ дорога", ending: "ая" },
    { id: 3, phrase: "прям_ значение", ending: "ое" },
    { id: 4, phrase: "прям_ линии", ending: "ые" },
  ] },
  { id: 25, phrases: [
    { id: 1, phrase: "вязан_ свитер", ending: "ый" },
    { id: 2, phrase: "вязан_ шапка", ending: "ая" },
    { id: 3, phrase: "вязан_ пальто", ending: "ое" },
    { id: 4, phrase: "вязан_ рукавицы", ending: "ые" },
  ] },
  { id: 26, phrases: [
    { id: 1, phrase: "небесн_ купол", ending: "ый" },
    { id: 2, phrase: "небесн_ ласточка", ending: "ая" },
    { id: 3, phrase: "небесн_ создание", ending: "ое" },
    { id: 4, phrase: "небесн_ тела", ending: "ые" },
  ] },
  { id: 27, phrases: [
    { id: 1, phrase: "воздушн_ поцелуй", ending: "ый" },
    { id: 2, phrase: "воздушн_ гимнастика", ending: "ая" },
    { id: 3, phrase: "воздушн_ судно", ending: "ое" },
    { id: 4, phrase: "воздушн_ шары", ending: "ые" },
  ] },
  { id: 28, phrases: [
    { id: 1, phrase: "мехов_ воротник", ending: "ой" },
    { id: 2, phrase: "мехов_ шуба", ending: "ая" },
    { id: 3, phrase: "мехов_ манто", ending: "ое" },
    { id: 4, phrase: "мехов_ варежки", ending: "ые" },
  ] },
  { id: 29, phrases: [
    { id: 1, phrase: "письменн_ стол", ending: "ый" },
    { id: 2, phrase: "письменн_ работа", ending: "ая" },
    { id: 3, phrase: "письменн_ задание", ending: "ое" },
    { id: 4, phrase: "письменн_ принадлежности", ending: "ые" },
  ] },
  { id: 30, phrases: [
    { id: 1, phrase: "остр_ перец", ending: "ый" },
    { id: 2, phrase: "остр_ лапша", ending: "ая" },
    { id: 3, phrase: "остр_ мнение", ending: "ое" },
    { id: 4, phrase: "остр_ углы", ending: "ые" },
  ] },
];

export const endingTasks: EndingTask[] = RAW_TASKS.map((t) => ({
  id: t.id,
  phrases: t.phrases.map((p) => {
    const { before, after } = splitPhraseWithBlank(p.phrase);
    return { id: `${t.id}-${p.id}`, before, correctEnding: p.ending, after };
  }),
}));
