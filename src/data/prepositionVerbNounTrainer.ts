const imageModules = import.meta.glob("../assets/preposition-verb-noun/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(fileName: string): string | undefined {
  const key = Object.keys(imageModules).find((k) => k.endsWith(`/${fileName}`));
  return key ? imageModules[key] : undefined;
}

export interface PrepositionImagePhrase {
  id: number;
  before: string;
  after: string;
  correctPreposition: string;
  imageUrl?: string;
}

export interface PrepositionImageTask {
  id: number;
  prepositions: string[];
  phrases: PrepositionImagePhrase[];
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
  { id: 1, prepositions: ["через", "с", "за", "над", "из", "на"], phrases: [
    { id: 1, phrase: "прыгает ... скакалку", correctPreposition: "через", image: "1_1.png" },
    { id: 2, phrase: "достает ... шляпы", correctPreposition: "из", image: "1_2.png" },
    { id: 3, phrase: "летит ... морем", correctPreposition: "над", image: "1_3.png" },
    { id: 4, phrase: "стоит ... столе", correctPreposition: "на", image: "1_4.png" },
    { id: 5, phrase: "прячет ... спиной", correctPreposition: "за", image: "1_5.png" },
    { id: 6, phrase: "катится ... горки", correctPreposition: "с", image: "1_6.png" },
  ] },
  { id: 2, prepositions: ["под", "из", "в", "на", "по", "за"], phrases: [
    { id: 1, phrase: "вешает ... веревку", correctPreposition: "на", image: "2_1.png" },
    { id: 2, phrase: "идет ... тропинке", correctPreposition: "по", image: "2_2.png" },
    { id: 3, phrase: "поливает ... лейки", correctPreposition: "из", image: "2_3.png" },
    { id: 4, phrase: "садится ... такси", correctPreposition: "в", image: "2_4.png" },
    { id: 5, phrase: "держит ... руку", correctPreposition: "за", image: "2_5.png" },
    { id: 6, phrase: "прячет ... кровать", correctPreposition: "под", image: "2_6.png" },
  ] },
  { id: 3, prepositions: ["с", "к", "у", "в", "на", "над"], phrases: [
    { id: 1, phrase: "Сидит ... кресле", correctPreposition: "в", image: "3_1.png" },
    { id: 2, phrase: "смотрит ... картину", correctPreposition: "на", image: "3_2.png" },
    { id: 3, phrase: "висит ... столом", correctPreposition: "над", image: "3_3.png" },
    { id: 4, phrase: "подплывает ... пристани", correctPreposition: "к", image: "3_4.png" },
    { id: 5, phrase: "стоит ... кресла", correctPreposition: "у", image: "3_5.png" },
    { id: 6, phrase: "играет ... мячом", correctPreposition: "с", image: "3_6.png" },
  ] },
  { id: 4, prepositions: ["за", "к", "вокруг", "в", "на", "из"], phrases: [
    { id: 1, phrase: "Кладёт ... корзину", correctPreposition: "в", image: "4_1.png" },
    { id: 2, phrase: "спит ... диване", correctPreposition: "на", image: "4_2.png" },
    { id: 3, phrase: "бежит ... другу", correctPreposition: "к", image: "4_3.png" },
    { id: 4, phrase: "ходят ... ёлки", correctPreposition: "вокруг", image: "4_4.png" },
    { id: 5, phrase: "бежит ... зайцем", correctPreposition: "за", image: "4_5.png" },
    { id: 6, phrase: "капает ... крана", correctPreposition: "из", image: "4_6.png" },
  ] },
  { id: 5, prepositions: ["из", "через", "в", "по", "над", "на"], phrases: [
    { id: 1, phrase: "Наливает ... чашку", correctPreposition: "в", image: "5_1.png" },
    { id: 2, phrase: "лежит ... столе", correctPreposition: "на", image: "5_2.png" },
    { id: 3, phrase: "перепрыгивает ... лужу", correctPreposition: "через", image: "5_3.png" },
    { id: 4, phrase: "гуляет ... парку", correctPreposition: "по", image: "5_4.png" },
    { id: 5, phrase: "летит ... деревьями", correctPreposition: "над", image: "5_5.png" },
    { id: 6, phrase: "пьёт ... чашки", correctPreposition: "из", image: "5_6.png" },
  ] },
  { id: 6, prepositions: ["по", "с", "под", "из-за", "в", "на"], phrases: [
    { id: 1, phrase: "ставит ... печь", correctPreposition: "в", image: "6_1.png" },
    { id: 2, phrase: "рисует ... бумаге", correctPreposition: "на", image: "6_2.png" },
    { id: 3, phrase: "смотрит ... угла", correctPreposition: "из-за", image: "6_3.png" },
    { id: 4, phrase: "плывет ... мостом", correctPreposition: "под", image: "6_4.png" },
    { id: 5, phrase: "танцует ... подругой", correctPreposition: "с", image: "6_5.png" },
    { id: 6, phrase: "едет ... рельсам", correctPreposition: "по", image: "6_6.png" },
  ] },
  { id: 7, prepositions: ["под", "на", "с", "в", "из", "у"], phrases: [
    { id: 1, phrase: "Сидит ... скамейке", correctPreposition: "на", image: "7_1.png" },
    { id: 2, phrase: "спит ... кроватке", correctPreposition: "в", image: "7_2.png" },
    { id: 3, phrase: "стоит ... навесом", correctPreposition: "под", image: "7_3.png" },
    { id: 4, phrase: "выливает ... ведра", correctPreposition: "из", image: "7_4.png" },
    { id: 5, phrase: "снять ... вешалки", correctPreposition: "с", image: "7_5.png" },
    { id: 6, phrase: "отвечает ... доски", correctPreposition: "у", image: "7_6.png" },
  ] },
  { id: 8, prepositions: ["у", "на", "к", "из", "по", "под"], phrases: [
    { id: 1, phrase: "Скачет ... лошади", correctPreposition: "на", image: "8_1.png" },
    { id: 2, phrase: "выходит ... самолёта", correctPreposition: "из", image: "8_2.png" },
    { id: 3, phrase: "растёт ... сосной", correctPreposition: "под", image: "8_3.png" },
    { id: 4, phrase: "скользит ... льду", correctPreposition: "по", image: "8_4.png" },
    { id: 5, phrase: "привязывает ... дереву", correctPreposition: "к", image: "8_5.png" },
    { id: 6, phrase: "ждет ... двери", correctPreposition: "у", image: "8_6.png" },
  ] },
  { id: 9, prepositions: ["над", "на", "из", "по", "около", "в"], phrases: [
    { id: 1, phrase: "Играет ... гитаре", correctPreposition: "на", image: "9_1.png" },
    { id: 2, phrase: "вылезает ... норы", correctPreposition: "из", image: "9_2.png" },
    { id: 3, phrase: "скачет ... полю", correctPreposition: "по", image: "9_3.png" },
    { id: 4, phrase: "бросает ... ящик", correctPreposition: "в", image: "9_4.png" },
    { id: 5, phrase: "стоит ... магазина", correctPreposition: "около", image: "9_5.png" },
    { id: 6, phrase: "висит ... камином", correctPreposition: "над", image: "9_6.png" },
  ] },
  { id: 10, prepositions: ["перед", "с", "из", "в", "у", "на"], phrases: [
    { id: 1, phrase: "Тащит ... воды", correctPreposition: "из", image: "10_1.png" },
    { id: 2, phrase: "покупает ... кассе", correctPreposition: "в", image: "10_2.png" },
    { id: 3, phrase: "растет ... забора", correctPreposition: "у", image: "10_3.png" },
    { id: 4, phrase: "наступил ... ногу", correctPreposition: "на", image: "10_4.png" },
    { id: 5, phrase: "прыгает ... вышки", correctPreposition: "с", image: "10_5.png" },
    { id: 6, phrase: "катит ... собой", correctPreposition: "перед", image: "10_6.png" },
  ] },
  { id: 11, prepositions: ["с", "из", "у", "через", "на", "в"], phrases: [
    { id: 1, phrase: "Лепит ... пластилина", correctPreposition: "из", image: "11_1.png" },
    { id: 2, phrase: "варит ... турке", correctPreposition: "в", image: "11_2.png" },
    { id: 3, phrase: "едет ... велосипеде", correctPreposition: "на", image: "11_3.png" },
    { id: 4, phrase: "перелезает ... забор", correctPreposition: "через", image: "11_4.png" },
    { id: 5, phrase: "слетел ... ветки", correctPreposition: "с", image: "11_5.png" },
    { id: 6, phrase: "сидит ... ручья", correctPreposition: "у", image: "11_6.png" },
  ] },
  { id: 12, prepositions: ["к", "в", "на", "с", "из", "за"], phrases: [
    { id: 1, phrase: "Мажет ... хлеб", correctPreposition: "на", image: "12_1.png" },
    { id: 2, phrase: "стирает ... доски", correctPreposition: "с", image: "12_2.png" },
    { id: 3, phrase: "выходит ... вагона", correctPreposition: "из", image: "12_3.png" },
    { id: 4, phrase: "едет ... автобусе", correctPreposition: "в", image: "12_4.png" },
    { id: 5, phrase: "сидят ... столом", correctPreposition: "за", image: "12_5.png" },
    { id: 6, phrase: "летит ... цветку", correctPreposition: "к", image: "12_6.png" },
  ] },
  { id: 13, prepositions: ["в", "через", "на", "из", "по", "под"], phrases: [
    { id: 1, phrase: "Стучит ... дверь", correctPreposition: "в", image: "13_1.png" },
    { id: 2, phrase: "нажимает ... кнопку", correctPreposition: "на", image: "13_2.png" },
    { id: 3, phrase: "вырывает ... тетради", correctPreposition: "из", image: "13_3.png" },
    { id: 4, phrase: "ползёт ... земле", correctPreposition: "по", image: "13_4.png" },
    { id: 5, phrase: "прыгают ... костёр", correctPreposition: "через", image: "13_5.png" },
    { id: 6, phrase: "закатился ... стол", correctPreposition: "под", image: "13_6.png" },
  ] },
  { id: 14, prepositions: ["через", "из", "в", "по", "на", "над"], phrases: [
    { id: 1, phrase: "Вылетел ... скворечника", correctPreposition: "из", image: "14_1.png" },
    { id: 2, phrase: "бежит ... стадиону", correctPreposition: "по", image: "14_2.png" },
    { id: 3, phrase: "играет ... гитаре", correctPreposition: "на", image: "14_3.png" },
    { id: 4, phrase: "смотрит ... бинокль", correctPreposition: "в", image: "14_4.png" },
    { id: 5, phrase: "прыгает ... кольцо", correctPreposition: "через", image: "14_5.png" },
    { id: 6, phrase: "несёт ... головой", correctPreposition: "над", image: "14_6.png" },
  ] },
  { id: 15, prepositions: ["с", "в", "на", "из", "по", "к"], phrases: [
    { id: 1, phrase: "Вылупился ... яйца", correctPreposition: "из", image: "15_1.png" },
    { id: 2, phrase: "пишет ... конверте", correctPreposition: "на", image: "15_2.png" },
    { id: 3, phrase: "читает ... библиотеке", correctPreposition: "в", image: "15_3.png" },
    { id: 4, phrase: "прыгает ... дивана", correctPreposition: "с", image: "15_4.png" },
    { id: 5, phrase: "ползёт ... листу", correctPreposition: "по", image: "15_5.png" },
    { id: 6, phrase: "пришить ... платью", correctPreposition: "к", image: "15_6.png" },
  ] },
];

export const prepositionImageTasks: PrepositionImageTask[] = RAW_TASKS.map((t) => ({
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
