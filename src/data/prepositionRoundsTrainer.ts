export interface PrepositionRoundPhrase {
  id: number;
  before: string;
  after: string;
  correctPreposition: string;
}

export interface PrepositionRoundCard {
  id: number;
  phrases: PrepositionRoundPhrase[];
}

export interface PrepositionRoundTask {
  id: number;
  prepositions: string[];
  cards: PrepositionRoundCard[];
}

type RawPhrase = { id: number; phrase: string; correctPreposition: string };
type RawCard = { id: number; phrases: RawPhrase[] };
type RawTask = { id: number; prepositions: string[]; cards: RawCard[] };

function splitPhraseWithBlank(raw: string): { before: string; after: string } {
  const parts = raw.split("…");
  const before = (parts[0] ?? "").trimEnd();
  const after = parts.slice(1).join("…").trimStart();
  return { before, after };
}

const RAW_TASKS: RawTask[] = [
  {
    id: 1,
    prepositions: ["в", "на"],
    cards: [
      {
        id: 1,
        phrases: [
          { id: 1, phrase: "ходить … школу", correctPreposition: "в" },
          { id: 2, phrase: "ходить … работу", correctPreposition: "на" },
          { id: 3, phrase: "покупать … магазине", correctPreposition: "в" },
          { id: 4, phrase: "покупать … рынке", correctPreposition: "на" },
          { id: 5, phrase: "висеть … шкафу", correctPreposition: "в" },
          { id: 6, phrase: "висеть … вешалке", correctPreposition: "на" },
        ],
      },
      {
        id: 2,
        phrases: [
          { id: 1, phrase: "гулять … парке", correctPreposition: "в" },
          { id: 2, phrase: "гулять … улице", correctPreposition: "на" },
          { id: 3, phrase: "работать … заводе", correctPreposition: "на" },
          { id: 4, phrase: "работать … поликлинике", correctPreposition: "в" },
          { id: 5, phrase: "сидеть … кресле", correctPreposition: "в" },
          { id: 6, phrase: "сидеть … диване", correctPreposition: "на" },
        ],
      },
      {
        id: 3,
        phrases: [
          { id: 1, phrase: "лежать … сумке", correctPreposition: "в" },
          { id: 2, phrase: "лежать … подоконнике", correctPreposition: "на" },
          { id: 3, phrase: "сажать … саду", correctPreposition: "в" },
          { id: 4, phrase: "сажать … грядке", correctPreposition: "на" },
          { id: 5, phrase: "вырасти … теплице", correctPreposition: "в" },
          { id: 6, phrase: "вырасти … огороде", correctPreposition: "на" },
        ],
      },
    ],
  },
  {
    id: 2,
    prepositions: ["из", "с"],
    cards: [
      {
        id: 1,
        phrases: [
          { id: 1, phrase: "вылететь … гнезда", correctPreposition: "из" },
          { id: 2, phrase: "слететь … дерева", correctPreposition: "с" },
          { id: 3, phrase: "выписаться … больницы", correctPreposition: "из" },
          { id: 4, phrase: "списать … доски", correctPreposition: "с" },
          { id: 5, phrase: "выглянуть … окна", correctPreposition: "из" },
          { id: 6, phrase: "бросить … балкона", correctPreposition: "с" },
        ],
      },
      {
        id: 2,
        phrases: [
          { id: 1, phrase: "выйти … дома", correctPreposition: "из" },
          { id: 2, phrase: "выйти (гулять) … собакой", correctPreposition: "с" },
          { id: 3, phrase: "выпекать … теста", correctPreposition: "из" },
          { id: 4, phrase: "выпекать … маком", correctPreposition: "с" },
          { id: 5, phrase: "пить … чашки", correctPreposition: "из" },
          { id: 6, phrase: "пить … лимоном", correctPreposition: "с" },
        ],
      },
    ],
  },
  {
    id: 3,
    prepositions: ["над", "под"],
    cards: [
      {
        id: 1,
        phrases: [
          { id: 1, phrase: "лететь … лесом", correctPreposition: "над" },
          { id: 2, phrase: "расти … деревьями", correctPreposition: "под" },
          { id: 3, phrase: "висеть … окном", correctPreposition: "над" },
          { id: 4, phrase: "стоять … окном", correctPreposition: "под" },
          { id: 5, phrase: "работать … докладом", correctPreposition: "над" },
          { id: 6, phrase: "работать … руководством", correctPreposition: "под" },
        ],
      },
      {
        id: 2,
        phrases: [
          { id: 1, phrase: "смеяться … шутками", correctPreposition: "над" },
          { id: 2, phrase: "танцевать … музыку", correctPreposition: "под" },
          { id: 3, phrase: "висеть … столом", correctPreposition: "над" },
          { id: 4, phrase: "уронить … стол", correctPreposition: "под" },
          { id: 5, phrase: "парить … горами", correctPreposition: "над" },
          { id: 6, phrase: "журчать … горой", correctPreposition: "под" },
        ],
      },
    ],
  },
  {
    id: 4,
    prepositions: ["по", "за"],
    cards: [
      {
        id: 1,
        phrases: [
          { id: 1, phrase: "пойти … дороге", correctPreposition: "по" },
          { id: 2, phrase: "пойти … грибами", correctPreposition: "за" },
          { id: 3, phrase: "принимать … часам", correctPreposition: "по" },
          { id: 4, phrase: "принимать … завтраком", correctPreposition: "за" },
          { id: 5, phrase: "хлопотать … хозяйству", correctPreposition: "по" },
          { id: 6, phrase: "ухаживать … животными", correctPreposition: "за" },
        ],
      },
      {
        id: 2,
        phrases: [
          { id: 1, phrase: "получать … заслугам", correctPreposition: "по" },
          { id: 2, phrase: "наградить … заслуги", correctPreposition: "за" },
          { id: 3, phrase: "ехать … маршруту", correctPreposition: "по" },
          { id: 4, phrase: "ехать … продуктами", correctPreposition: "за" },
          { id: 5, phrase: "говорить … телефону", correctPreposition: "по" },
          { id: 6, phrase: "заплатить … телефон", correctPreposition: "за" },
        ],
      },
      {
        id: 3,
        phrases: [
          { id: 1, phrase: "скучать … родителям", correctPreposition: "по" },
          { id: 2, phrase: "волноваться … детей", correctPreposition: "за" },
          { id: 3, phrase: "отправить … почте", correctPreposition: "по" },
          { id: 4, phrase: "отправиться … покупками", correctPreposition: "за" },
          { id: 5, phrase: "идти … следу", correctPreposition: "по" },
          { id: 6, phrase: "гнаться … преступником", correctPreposition: "за" },
        ],
      },
    ],
  },
  {
    id: 5,
    prepositions: ["до", "по"],
    cards: [
      {
        id: 1,
        phrases: [
          { id: 1, phrase: "добраться … дома", correctPreposition: "до" },
          { id: 2, phrase: "убираться … дому", correctPreposition: "по" },
          { id: 3, phrase: "гулять … вечера", correctPreposition: "до" },
          { id: 4, phrase: "гулять … вечерам", correctPreposition: "по" },
          { id: 5, phrase: "работать … утра", correctPreposition: "до" },
          { id: 6, phrase: "работать … специальности", correctPreposition: "по" },
        ],
      },
    ],
  },
  {
    id: 6,
    prepositions: ["к", "от"],
    cards: [
      {
        id: 1,
        phrases: [
          { id: 1, phrase: "подойти … остановке", correctPreposition: "к" },
          { id: 2, phrase: "отъехать … остановки", correctPreposition: "от" },
          { id: 3, phrase: "прибежать … приятелю", correctPreposition: "к" },
          { id: 4, phrase: "убежать … погони", correctPreposition: "от" },
          { id: 5, phrase: "присоединиться … группе", correctPreposition: "к" },
          { id: 6, phrase: "отстать … отряда", correctPreposition: "от" },
        ],
      },
    ],
  },
  {
    id: 7,
    prepositions: ["через", "в"],
    cards: [
      {
        id: 1,
        phrases: [
          { id: 1, phrase: "пройти … тоннель", correctPreposition: "через" },
          { id: 2, phrase: "пройти … комнату", correctPreposition: "через" },
          { id: 3, phrase: "прыгать … скакалку", correctPreposition: "через" },
          { id: 4, phrase: "прыгать … бассейн", correctPreposition: "в" },
          { id: 5, phrase: "переплыть … реку", correctPreposition: "через" },
          { id: 6, phrase: "плавать … реке", correctPreposition: "в" },
        ],
      },
    ],
  },
  {
    id: 8,
    prepositions: ["за", "из"],
    cards: [
      {
        id: 1,
        phrases: [
          { id: 1, phrase: "зайти … другом", correctPreposition: "за" },
          { id: 2, phrase: "выйти … подъезда", correctPreposition: "из" },
          { id: 3, phrase: "наблюдать … детьми", correctPreposition: "за" },
          { id: 4, phrase: "наблюдать … окна", correctPreposition: "из" },
          { id: 5, phrase: "бороться … честь школы", correctPreposition: "за" },
          { id: 6, phrase: "исключить … школы", correctPreposition: "из" },
        ],
      },
    ],
  },
  {
    id: 9,
    prepositions: ["на", "над"],
    cards: [
      {
        id: 1,
        phrases: [
          { id: 1, phrase: "висеть … вешалке", correctPreposition: "на" },
          { id: 2, phrase: "висеть … окном", correctPreposition: "над" },
          { id: 3, phrase: "хохотать … клоуном", correctPreposition: "над" },
          { id: 4, phrase: "хохотать … представлении", correctPreposition: "на" },
          { id: 5, phrase: "шептать … ухо", correctPreposition: "на" },
          { id: 6, phrase: "стоять … душой", correctPreposition: "над" },
        ],
      },
    ],
  },
];

export const prepositionRoundTasks: PrepositionRoundTask[] = RAW_TASKS.map((t) => ({
  id: t.id,
  prepositions: t.prepositions,
  cards: t.cards.map((c) => ({
    id: c.id,
    phrases: c.phrases.map((p) => {
      const { before, after } = splitPhraseWithBlank(p.phrase);
      return { id: p.id, before, after, correctPreposition: p.correctPreposition };
    }),
  })),
}));
