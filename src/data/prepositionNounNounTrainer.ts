const imageModules = import.meta.glob("../assets/preposition-noun-noun/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(fileName: string): string | undefined {
  const key = Object.keys(imageModules).find((k) => k.endsWith(`/${fileName}`));
  return key ? imageModules[key] : undefined;
}

export interface PrepositionNounImagePhrase {
  id: number;
  before: string;
  after: string;
  correctPreposition: string;
  imageUrl?: string;
}

export interface PrepositionNounImageTask {
  id: number;
  prepositions: string[];
  phrases: PrepositionNounImagePhrase[];
}

export const CARDS_BY_LEVEL: Record<1 | 2 | 3, number> = { 1: 2, 2: 4, 3: 6 };

function splitPhraseWithBlank(raw: string): { before: string; after: string } {
  const normalized = raw.replace(/\.\.\./g, "\u2026");
  const parts = normalized.split(/\s*\u2026\s*/);
  const before = (parts[0] ?? "").trimEnd();
  const after = parts.slice(1).join(" ").trimStart();
  return { before, after };
}

const RAW_TASKS = [
  { id: 1, prepositions: ["с", "без", "на", "через", "у", "под"], phrases: [
    { id: 1, phrase: "тарелка ... яблоками", correctPreposition: "с", image: "1_1.png" },
    { id: 2, phrase: "платье ... рукавов", correctPreposition: "без", image: "1_2.png" },
    { id: 3, phrase: "гнездо ... ветке", correctPreposition: "на", image: "1_3.png" },
    { id: 4, phrase: "мост ... реку", correctPreposition: "через", image: "1_4.png" },
    { id: 5, phrase: "берёза ... забора", correctPreposition: "у", image: "1_5.png" },
    { id: 6, phrase: "сугроб ... окном", correctPreposition: "под", image: "1_6.png" },
  ] },
  { id: 2, prepositions: ["с", "из", "в", "без", "на", "над"], phrases: [
    { id: 1, phrase: "пирожное ... кремом", correctPreposition: "с", image: "2_1.png" },
    { id: 2, phrase: "ваза ... стекла", correctPreposition: "из", image: "2_2.png" },
    { id: 3, phrase: "сосиска ... тесте", correctPreposition: "в", image: "2_3.png" },
    { id: 4, phrase: "перекресток ... светофора", correctPreposition: "без", image: "2_4.png" },
    { id: 5, phrase: "картина ... стене", correctPreposition: "на", image: "2_5.png" },
    { id: 6, phrase: "люстра ... столом", correctPreposition: "над", image: "2_6.png" },
  ] },
  { id: 3, prepositions: ["с", "в", "на", "у", "за", "над"], phrases: [
    { id: 1, phrase: "шкаф ... книгами", correctPreposition: "с", image: "3_1.png" },
    { id: 2, phrase: "собака ... будке", correctPreposition: "в", image: "3_2.png" },
    { id: 3, phrase: "шляпа ... голове", correctPreposition: "на", image: "3_3.png" },
    { id: 4, phrase: "фонарь ... скамейки", correctPreposition: "у", image: "3_4.png" },
    { id: 5, phrase: "солнце ... тучей", correctPreposition: "за", image: "3_5.png" },
    { id: 6, phrase: "бабочка ... цветком", correctPreposition: "над", image: "3_6.png" },
  ] },
  { id: 4, prepositions: ["с", "на", "в", "без", "вокруг", "над"], phrases: [
    { id: 1, phrase: "книжка ... картинками", correctPreposition: "с", image: "4_1.png" },
    { id: 2, phrase: "шишка ... ветке", correctPreposition: "на", image: "4_2.png" },
    { id: 3, phrase: "дупло ... дереве", correctPreposition: "в", image: "4_3.png" },
    { id: 4, phrase: "чайник ... крышки", correctPreposition: "без", image: "4_4.png" },
    { id: 5, phrase: "стулья ... стола", correctPreposition: "вокруг", image: "4_5.png" },
    { id: 6, phrase: "переход ... дорогой", correctPreposition: "над", image: "4_6.png" },
  ] },
  { id: 5, prepositions: ["на", "в", "из", "под", "с", "вдоль"], phrases: [
    { id: 1, phrase: "кольцо ... пальце", correctPreposition: "на", image: "5_1.png" },
    { id: 2, phrase: "конфеты ... вазе", correctPreposition: "в", image: "5_2.png" },
    { id: 3, phrase: "самолётик ... бумаги", correctPreposition: "из", image: "5_3.png" },
    { id: 4, phrase: "фингал ... глазом", correctPreposition: "под", image: "5_4.png" },
    { id: 5, phrase: "машина ... прицепом", correctPreposition: "с", image: "5_5.png" },
    { id: 6, phrase: "тропинка ... моря", correctPreposition: "вдоль", image: "5_6.png" },
  ] },
  { id: 6, prepositions: ["на", "из", "в", "с", "около", "без"], phrases: [
    { id: 1, phrase: "котёнок ... заборе", correctPreposition: "на", image: "6_1.png" },
    { id: 2, phrase: "веник ... берёзы", correctPreposition: "из", image: "6_2.png" },
    { id: 3, phrase: "картина ... раме", correctPreposition: "в", image: "6_3.png" },
    { id: 4, phrase: "карандаш ... ластиком", correctPreposition: "с", image: "6_4.png" },
    { id: 5, phrase: "пруд ... дома", correctPreposition: "около", image: "6_5.png" },
    { id: 6, phrase: "арбуз ... семечек", correctPreposition: "без", image: "6_6.png" },
  ] },
  { id: 7, prepositions: ["на", "из", "с", "в", "между", "под"], phrases: [
    { id: 1, phrase: "книги ... полке", correctPreposition: "на", image: "7_1.png" },
    { id: 2, phrase: "сок ... апельсина", correctPreposition: "из", image: "7_2.png" },
    { id: 3, phrase: "куртка ... капюшоном", correctPreposition: "с", image: "7_3.png" },
    { id: 4, phrase: "машина ... гараже", correctPreposition: "в", image: "7_4.png" },
    { id: 5, phrase: "стол ... креслами", correctPreposition: "между", image: "7_5.png" },
    { id: 6, phrase: "подарки ... ёлкой", correctPreposition: "под", image: "7_6.png" },
  ] },
  { id: 8, prepositions: ["на", "в", "с", "между", "над", "из"], phrases: [
    { id: 1, phrase: "скатерть ... столе", correctPreposition: "на", image: "8_1.png" },
    { id: 2, phrase: "ленточка ... косе", correctPreposition: "в", image: "8_2.png" },
    { id: 3, phrase: "салат ... креветками", correctPreposition: "с", image: "8_3.png" },
    { id: 4, phrase: "гамак ... деревьями", correctPreposition: "между", image: "8_4.png" },
    { id: 5, phrase: "туман ... озером", correctPreposition: "над", image: "8_5.png" },
    { id: 6, phrase: "воротник ... меха", correctPreposition: "из", image: "8_6.png" },
  ] },
  { id: 9, prepositions: ["на", "в", "с", "над", "из", "без"], phrases: [
    { id: 1, phrase: "часы ... руке", correctPreposition: "на", image: "9_1.png" },
    { id: 2, phrase: "клубника ... миске", correctPreposition: "в", image: "9_2.png" },
    { id: 3, phrase: "шляпа ... пером", correctPreposition: "с", image: "9_3.png" },
    { id: 4, phrase: "радуга ... рекой", correctPreposition: "над", image: "9_4.png" },
    { id: 5, phrase: "варенье ... клубники", correctPreposition: "из", image: "9_5.png" },
    { id: 6, phrase: "дерево ... листьев", correctPreposition: "без", image: "9_6.png" },
  ] },
  { id: 10, prepositions: ["на", "в", "с", "из", "у", "для"], phrases: [
    { id: 1, phrase: "календарь ... столе", correctPreposition: "на", image: "10_1.png" },
    { id: 2, phrase: "эскимо ... шоколаде", correctPreposition: "в", image: "10_2.png" },
    { id: 3, phrase: "булочка ... изюмом", correctPreposition: "с", image: "10_3.png" },
    { id: 4, phrase: "дым ... трубы", correctPreposition: "из", image: "10_4.png" },
    { id: 5, phrase: "кафе ... моря", correctPreposition: "у", image: "10_5.png" },
    { id: 6, phrase: "футляр ... скрипки", correctPreposition: "для", image: "10_6.png" },
  ] },
  { id: 11, prepositions: ["на", "в", "со", "перед", "от", "у"], phrases: [
    { id: 1, phrase: "замок ... двери", correctPreposition: "на", image: "11_1.png" },
    { id: 2, phrase: "тетрадь ... клетку", correctPreposition: "в", image: "11_2.png" },
    { id: 3, phrase: "торт ... свечками", correctPreposition: "со", image: "11_3.png" },
    { id: 4, phrase: "клумба ... домом", correctPreposition: "перед", image: "11_4.png" },
    { id: 5, phrase: "колесо ... велосипеда", correctPreposition: "от", image: "11_5.png" },
    { id: 6, phrase: "дом ... реки", correctPreposition: "у", image: "11_6.png" },
  ] },
  { id: 12, prepositions: ["на", "с", "от", "у", "в", "из"], phrases: [
    { id: 1, phrase: "муха ... лампочке", correctPreposition: "на", image: "12_1.png" },
    { id: 2, phrase: "кофе ... молоком", correctPreposition: "с", image: "12_2.png" },
    { id: 3, phrase: "пульт ... телевизора", correctPreposition: "от", image: "12_3.png" },
    { id: 4, phrase: "косы ... девочки", correctPreposition: "у", image: "12_4.png" },
    { id: 5, phrase: "очки ... очечнике", correctPreposition: "в", image: "12_5.png" },
    { id: 6, phrase: "ремень ... кожи", correctPreposition: "из", image: "12_6.png" },
  ] },
  { id: 13, prepositions: ["на", "с", "от", "для", "в", "из"], phrases: [
    { id: 1, phrase: "куртка ... молнии", correctPreposition: "на", image: "13_1.png" },
    { id: 2, phrase: "брюки ... карманами", correctPreposition: "с", image: "13_2.png" },
    { id: 3, phrase: "крышка ... кастрюли", correctPreposition: "от", image: "13_3.png" },
    { id: 4, phrase: "полотенце ... ног", correctPreposition: "для", image: "13_4.png" },
    { id: 5, phrase: "оценка ... дневнике", correctPreposition: "в", image: "13_5.png" },
    { id: 6, phrase: "омлет ... яиц", correctPreposition: "из", image: "13_6.png" },
  ] },
  { id: 14, prepositions: ["с", "из", "на", "для", "от", "у"], phrases: [
    { id: 1, phrase: "мотоцикл ... коляской", correctPreposition: "с", image: "14_1.png" },
    { id: 2, phrase: "крыша ... черепицы", correctPreposition: "из", image: "14_2.png" },
    { id: 3, phrase: "татуировка ... руке", correctPreposition: "на", image: "14_3.png" },
    { id: 4, phrase: "тушь ... ресниц", correctPreposition: "для", image: "14_4.png" },
    { id: 5, phrase: "стержень ... ручки", correctPreposition: "от", image: "14_5.png" },
    { id: 6, phrase: "рога ... коровы", correctPreposition: "у", image: "14_6.png" },
  ] },
  { id: 15, prepositions: ["с", "на", "для", "от", "у", "в"], phrases: [
    { id: 1, phrase: "фантик ... конфет", correctPreposition: "от", image: "15_1.png" },
    { id: 2, phrase: "румянец ... щеках", correctPreposition: "на", image: "15_2.png" },
    { id: 3, phrase: "крем ... обуви", correctPreposition: "для", image: "15_3.png" },
    { id: 4, phrase: "лавочка ... подъезда", correctPreposition: "у", image: "15_4.png" },
    { id: 5, phrase: "тропка ... лесу", correctPreposition: "в", image: "15_5.png" },
    { id: 6, phrase: "ящик ... инструментами", correctPreposition: "с", image: "15_6.png" },
  ] },
];

export const prepositionNounImageTasks: PrepositionNounImageTask[] = RAW_TASKS.map((t) => ({
  id: t.id,
  prepositions: t.prepositions,
  phrases: t.phrases.map((p) => {
    const { before, after } = splitPhraseWithBlank(p.phrase);
    return {
      id: p.id,
      before,
      after,
      correctPreposition: p.correctPreposition,
      imageUrl: resolveImage(p.image),
    };
  }),
}));
