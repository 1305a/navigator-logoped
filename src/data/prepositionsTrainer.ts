export interface PrepositionPhrase {
  id: string;
  before: string;
  after: string;
  correctPreposition: string;
}

export interface PrepositionTask {
  id: number;
  phrases: PrepositionPhrase[];
}

export interface PrepositionLevel {
  id: number;
  level: number;
  tasks: PrepositionTask[];
}

type RawPhrase = { id: number; phrase: string; preposition: string };
type RawTask = { id: number; phrases: RawPhrase[] };
type RawLevel = { id: number; level: number; tasks: RawTask[] };

function splitPhraseWithBlank(raw: string): { before: string; after: string } {
  const parts = raw.split("_");
  const before = (parts[0] ?? "").trimEnd();
  const after = parts.slice(1).join("_").trimStart();
  return { before, after };
}

const RAW_LEVELS: RawLevel[] = [
  {
    id: 1,
    level: 1,
    tasks: [
      { id: 1, phrases: [{ id: 1, phrase: "Птица сидит _ клетке", preposition: "в" }, { id: 2, phrase: "Белка сидит _ ветке", preposition: "на" }, { id: 3, phrase: "Кошка сидит _ лавкой", preposition: "под" }] },
      { id: 2, phrases: [{ id: 1, phrase: "Огурцы растут _ парнике", preposition: "в" }, { id: 2, phrase: "Шишки растут _ ёлке", preposition: "на" }, { id: 3, phrase: "Огурцы растут _ плёнкой", preposition: "под" }] },
      { id: 3, phrases: [{ id: 1, phrase: "Календарь висит _ полкой", preposition: "под" }, { id: 2, phrase: "Шуба висит _ шкафу", preposition: "в" }, { id: 3, phrase: "Бельё висит _ верёвке", preposition: "на" }] },
      { id: 4, phrases: [{ id: 1, phrase: "Туфли надевают _ платье", preposition: "под" }, { id: 2, phrase: "Костюм надевают _ праздник", preposition: "на" }, { id: 3, phrase: "Кеды надевают _ спортивный зал", preposition: "в" }] },
      { id: 5, phrases: [{ id: 1, phrase: "Собака сидит _ конуре", preposition: "в" }, { id: 2, phrase: "Заяц сидит _ кустом", preposition: "под" }, { id: 3, phrase: "Ученик сидит _ стуле", preposition: "на" }] },
      { id: 6, phrases: [{ id: 1, phrase: "Картошка лежит _ мешке", preposition: "в" }, { id: 2, phrase: "Монета лежит _ столе", preposition: "на" }, { id: 3, phrase: "Собака лежит _ деревом", preposition: "под" }] },
      { id: 7, phrases: [{ id: 1, phrase: "Господин идёт _ аллее", preposition: "по" }, { id: 2, phrase: "Дедушка идёт _ поликлинику", preposition: "в" }, { id: 3, phrase: "Девушка идёт _ чемоданом", preposition: "с" }] },
      { id: 8, phrases: [{ id: 1, phrase: "Птица летит _ небу", preposition: "по" }, { id: 2, phrase: "Пассажир летит _ самолёте", preposition: "в" }, { id: 3, phrase: "Женщина летит _ ребенком", preposition: "с" }] },
      { id: 9, phrases: [{ id: 1, phrase: "Бабушка готовит _ духовке", preposition: "в" }, { id: 2, phrase: "Повар готовит _ рецепту", preposition: "по" }, { id: 3, phrase: "Мама готовит _ любовью", preposition: "с" }] },
      { id: 10, phrases: [{ id: 1, phrase: "Малыш рисует _ альбоме", preposition: "в" }, { id: 2, phrase: "Художник рисует _ натуры", preposition: "с" }, { id: 3, phrase: "Хулиган рисует _ стене", preposition: "на" }] },
      { id: 11, phrases: [{ id: 1, phrase: "Вещи складывают _ полку", preposition: "на" }, { id: 2, phrase: "Самолетик складывают _ бумаги", preposition: "из" }, { id: 3, phrase: "Числа складывают _ уме", preposition: "в" }] },
      { id: 12, phrases: [{ id: 1, phrase: "Торшер стоит _ кресла", preposition: "у" }, { id: 2, phrase: "Ваза стоит _ столе", preposition: "на" }, { id: 3, phrase: "Пиво стоит _ холодильнике", preposition: "в" }] },
      { id: 13, phrases: [{ id: 1, phrase: "Студент занимается _ репетитором", preposition: "с" }, { id: 2, phrase: "Спортсмен занимается _ зале", preposition: "в" }, { id: 3, phrase: "Школьник занимается _ расписанию", preposition: "по" }] },
      { id: 14, phrases: [{ id: 1, phrase: "Няня смотрит _ ребенком", preposition: "за" }, { id: 2, phrase: "Моряк смотрит _ бинокль", preposition: "в" }, { id: 3, phrase: "Тренер смотрит _ секундомер", preposition: "на" }] },
      { id: 15, phrases: [{ id: 1, phrase: "Овощи покупают _ рынке", preposition: "на" }, { id: 2, phrase: "Диван покупают _ магазине", preposition: "в" }, { id: 3, phrase: "Торт покупают _ празднику", preposition: "к" }] },
    ],
  },
  {
    id: 2,
    level: 2,
    tasks: [
      { id: 1, phrases: [{ id: 1, phrase: "Куртка висит _ вешалке", preposition: "на" }, { id: 2, phrase: "Куртку продают _ магазине", preposition: "в" }, { id: 3, phrase: "Куртка не промокает _ дождём", preposition: "под" }, { id: 4, phrase: "Куртка защищает _ холода", preposition: "от" }, { id: 5, phrase: "Куртка сшита _ кожи", preposition: "из" }, { id: 6, phrase: "Я купил куртку _ капюшоном", preposition: "с" }] },
      { id: 2, phrases: [{ id: 1, phrase: "Сыр продают _ магазине", preposition: "в" }, { id: 2, phrase: "Сыр кладут _ хлеб", preposition: "на" }, { id: 3, phrase: "Сыр делают _ молока", preposition: "из" }, { id: 4, phrase: "Сыр подают _ вину", preposition: "к" }, { id: 5, phrase: "Сыр едят _ макаронами", preposition: "с" }, { id: 6, phrase: "Сыр упал _ стол", preposition: "под" }] },
      { id: 3, phrases: [{ id: 1, phrase: "Собака лает _ кошку", preposition: "на" }, { id: 2, phrase: "Собаку взяли _ приюта", preposition: "из" }, { id: 3, phrase: "Собаку выгуливают _ парке", preposition: "в" }, { id: 4, phrase: "Собака бежит _ хозяйкой", preposition: "за" }, { id: 5, phrase: "Собака сидит _ стола", preposition: "у" }, { id: 6, phrase: "Собака подбежала _ двери", preposition: "к" }] },
      { id: 4, phrases: [{ id: 1, phrase: "Попугай сидит _ клетке", preposition: "в" }, { id: 2, phrase: "Попугай летает _ комнате", preposition: "по" }, { id: 3, phrase: "Попугай спрыгнул _ жёрдочки", preposition: "с" }, { id: 4, phrase: "Попугай вылетел _ клетки", preposition: "из" }, { id: 5, phrase: "Попугай сел _ плечо", preposition: "на" }, { id: 6, phrase: "Попугай пролетел _ столом", preposition: "над" }] },
      { id: 5, phrases: [{ id: 1, phrase: "Машина едет _ дороге", preposition: "по" }, { id: 2, phrase: "Машина свернула _ угол", preposition: "за" }, { id: 3, phrase: "Машина остановилась _ пешеходного перехода", preposition: "у" }, { id: 4, phrase: "Машину поставили _ гараж", preposition: "в" }, { id: 5, phrase: "Машина стоит _ парковке", preposition: "на" }, { id: 6, phrase: "Машина подъехала _ дому", preposition: "к" }] },
      { id: 6, phrases: [{ id: 1, phrase: "Ребёнок ходит _ детский садик", preposition: "в" }, { id: 2, phrase: "Ребёнка выписали _ больницы", preposition: "из" }, { id: 3, phrase: "Ребёнок гуляет _ бабушкой", preposition: "с" }, { id: 4, phrase: "Ребёнка готовят _ школе", preposition: "к" }, { id: 5, phrase: "Ребёнок ходит _ танцы", preposition: "на" }, { id: 6, phrase: "Ребёнок спрятался _ дерево", preposition: "за" }] },
      { id: 7, phrases: [{ id: 1, phrase: "Книга стоит _ полке", preposition: "на" }, { id: 2, phrase: "Книгу читают _ вечерам", preposition: "по" }, { id: 3, phrase: "Книгу продают _ магазине", preposition: "в" }, { id: 4, phrase: "Книга сделана _ бумаги", preposition: "из" }, { id: 5, phrase: "Книга упала _ стол", preposition: "под" }, { id: 6, phrase: "Книгу оставили _ соседа", preposition: "у" }] },
      { id: 8, phrases: [{ id: 1, phrase: "Солнце светит _ окно", preposition: "в" }, { id: 2, phrase: "Солнце поднимается _ горизонтом", preposition: "над" }, { id: 3, phrase: "Легко обгореть _ солнцем", preposition: "на" }, { id: 4, phrase: "Под зонтиком укрылись _ солнца", preposition: "от" }, { id: 5, phrase: "Солнце прячется _ тучи", preposition: "за" }, { id: 6, phrase: "Бельё быстро высохло _ солнце", preposition: "на" }] },
      { id: 9, phrases: [{ id: 1, phrase: "Волк гонится _ зайцем", preposition: "за" }, { id: 2, phrase: "Волк воет _ луну", preposition: "на" }, { id: 3, phrase: "Волк прячется _ чаще", preposition: "в" }, { id: 4, phrase: "Волк выскочил _ леса", preposition: "из" }, { id: 5, phrase: "Волк уходит _ погони", preposition: "от" }, { id: 6, phrase: "Волк подкрался _ добыче", preposition: "к" }] },
      { id: 10, phrases: [{ id: 1, phrase: "Дождь идёт _ улице", preposition: "на" }, { id: 2, phrase: "Дождь барабанит _ крыше", preposition: "по" }, { id: 3, phrase: "Мы спрятались _ дождя", preposition: "от" }, { id: 4, phrase: "Дети бегают _ дождем", preposition: "под" }, { id: 5, phrase: "Ласточки низко летают _ дождю", preposition: "перед" }, { id: 6, phrase: "Всё затихает _ дождём", preposition: "к" }] },
      { id: 11, phrases: [{ id: 1, phrase: "Малина растёт _ саду", preposition: "в" }, { id: 2, phrase: "Варенье варят _ малины", preposition: "из" }, { id: 3, phrase: "Больной пьёт чай _ малиной", preposition: "с" }, { id: 4, phrase: "Мы пошли в лес _ малиной", preposition: "за" }, { id: 5, phrase: "Бывает аллергия _ малину", preposition: "на" }, { id: 6, phrase: "Пчёлы летают _ малиной", preposition: "над" }] },
      { id: 12, phrases: [{ id: 1, phrase: "Младенца кормят _ часам", preposition: "по" }, { id: 2, phrase: "Встретимся на площади _ часами", preposition: "под" }, { id: 3, phrase: "Час _ часу не легче", preposition: "от" }, { id: 4, phrase: "Половина восьмого _ часах", preposition: "на" }, { id: 5, phrase: "Подобрали ремешок _ часам", preposition: "к" }, { id: 6, phrase: "Сломался механизм _ часах", preposition: "в" }] },
      { id: 13, phrases: [{ id: 1, phrase: "Студенты спешат _ аудиторию", preposition: "в" }, { id: 2, phrase: "Состоится лекция _ студентов первого курса", preposition: "для" }, { id: 3, phrase: "Студенты готовятся _ зачёту", preposition: "к" }, { id: 4, phrase: "Преподаватель встретился _ студентами", preposition: "с" }, { id: 5, phrase: "Экзамен принимают _ студентов-заочников", preposition: "у" }, { id: 6, phrase: "Идёт обсуждение вопросов _ студентами", preposition: "между" }] },
      { id: 14, phrases: [{ id: 1, phrase: "Мёрзнут руки _ ветру", preposition: "на" }, { id: 2, phrase: "Держи нос _ ветру", preposition: "по" }, { id: 3, phrase: "Качаются деревья _ ветра", preposition: "от" }, { id: 4, phrase: "Ветер дует _ севера", preposition: "с" }, { id: 5, phrase: "Путники шли _ ветер и дождь", preposition: "сквозь" }, { id: 6, phrase: "Поднялся ветер _ грозой", preposition: "перед" }] },
      { id: 15, phrases: [{ id: 1, phrase: "Родителей вызвали _ собрание", preposition: "на" }, { id: 2, phrase: "Нужно пройти регистрацию _ собранием", preposition: "перед" }, { id: 3, phrase: "Отчёт подготовили _ собранию", preposition: "к" }, { id: 4, phrase: "Концерт состоится _ собрания", preposition: "после" }, { id: 5, phrase: "Мы поздно вернулись _ родительского собрания", preposition: "с" }] },
    ],
  },
];

export const prepositionLevels: PrepositionLevel[] = RAW_LEVELS.map((lvl) => ({
  id: lvl.id,
  level: lvl.level,
  tasks: lvl.tasks.map((t) => ({
    id: t.id,
    phrases: t.phrases.map((p) => {
      const { before, after } = splitPhraseWithBlank(p.phrase);
      return { id: `${lvl.level}-${t.id}-${p.id}`, before, after, correctPreposition: p.preposition };
    }),
  })),
}));
