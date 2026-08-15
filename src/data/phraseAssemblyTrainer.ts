export type PhraseRole =
  | "who"
  | "verb"
  | "object"
  | "tool"
  | "place"
  | "whom"
  | "where_to"
  | "where"
  | "when"
  | "what_kind"
  | "with_what"
  | "on_what"
  | "how"
  | "from_what";

export interface PhraseAssemblyPhrase {
  id: number;
  correct: Partial<Record<PhraseRole, string>>;
}

export interface PhraseAssemblyTask {
  id: number;
  hints: string[];
  phrases: PhraseAssemblyPhrase[];
}

export const phraseAssemblyTasks: PhraseAssemblyTask[] = [
  {
    id: 1,
    hints: ["Кто?", "Что делает?", "Что?", "Чем?"],
    phrases: [
      { id: 1, correct: { who: "девушка", verb: "красит", object: "губы", tool: "помадой" } },
      { id: 2, correct: { who: "хозяйка", verb: "раскатывает", object: "тесто", tool: "скалкой" } },
      { id: 3, correct: { who: "садовник", verb: "подстригает", object: "кусты", tool: "секатором" } },
      { id: 4, correct: { who: "работница", verb: "вытирает", object: "лоб", tool: "платком" } },
      { id: 5, correct: { who: "дама", verb: "обмахивает", object: "лицо", tool: "веером" } },
      { id: 6, correct: { who: "парикмахер", verb: "сушит", object: "волосы", tool: "феном" } },
    ],
  },
  {
    id: 2,
    hints: ["Кто?", "Что делает?", "Что?", "Где?"],
    phrases: [
      { id: 1, correct: { who: "хирург", verb: "проводит", object: "операцию", place: "в больнице" } },
      { id: 2, correct: { who: "швея", verb: "шьёт", object: "брюки", place: "в ателье" } },
      { id: 3, correct: { who: "мальчик", verb: "уступает", object: "место", place: "в автобусе" } },
      { id: 4, correct: { who: "дачник", verb: "сажает", object: "огурцы", place: "на грядке" } },
      { id: 5, correct: { who: "гид", verb: "проводит", object: "экскурсию", place: "в музее" } },
      { id: 6, correct: { who: "девушка", verb: "пьёт", object: "кофе", place: "в кафе" } },
    ],
  },
  {
    id: 3,
    hints: ["Какой?", "Кто?", "Что делает?", "Что?"],
    phrases: [
      { id: 1, correct: { what_kind: "рыжий", who: "клоун", verb: "показывает", object: "фокусы" } },
      { id: 2, correct: { what_kind: "серый", who: "заяц", verb: "грызёт", object: "кору" } },
      { id: 3, correct: { what_kind: "усердный", who: "ученик", verb: "сдаёт", object: "экзамены" } },
      { id: 4, correct: { what_kind: "маленький", who: "муравей", verb: "тащит", object: "соломинку" } },
      { id: 5, correct: { what_kind: "бурый", who: "медведь", verb: "ест", object: "малину" } },
      { id: 6, correct: { what_kind: "молодой", who: "режиссёр", verb: "снимает", object: "сериал" } },
    ],
  },
  {
    id: 4,
    hints: ["Какая?", "Кто?", "Что делает?", "Что?"],
    phrases: [
      { id: 1, correct: { what_kind: "маленькая", who: "девочка", verb: "плетёт", object: "венок" } },
      { id: 2, correct: { what_kind: "дикая", who: "утка", verb: "чистит", object: "перья" } },
      { id: 3, correct: { what_kind: "талантливая", who: "актриса", verb: "репетирует", object: "роль" } },
      { id: 4, correct: { what_kind: "сторожевая", who: "собака", verb: "охраняет", object: "дом" } },
      { id: 5, correct: { what_kind: "пёстрая", who: "курица", verb: "клюёт", object: "зерно" } },
      { id: 6, correct: { what_kind: "старшая", who: "сестра", verb: "подметает", object: "пол" } },
    ],
  },
  {
    id: 5,
    hints: ["Кто?", "Что делает?", "Какую?", "Что?"],
    phrases: [
      { id: 1, correct: { who: "парикмахер", verb: "делает", what_kind: "модную", object: "прическу" } },
      { id: 2, correct: { who: "рыбак", verb: "покупает", what_kind: "надувную", object: "лодку" } },
      { id: 3, correct: { who: "дачник", verb: "сажает", what_kind: "цветную", object: "капусту" } },
      { id: 4, correct: { who: "девушка", verb: "плетёт", what_kind: "русую", object: "косу" } },
      { id: 5, correct: { who: "мышка", verb: "грызёт", what_kind: "чёрствую", object: "булку" } },
      { id: 6, correct: { who: "пловец", verb: "переплывает", what_kind: "горную", object: "реку" } },
    ],
  },
  {
    id: 6,
    hints: ["Кто?", "Что делает?", "Какое?", "Что?"],
    phrases: [
      { id: 1, correct: { who: "швея", verb: "шьёт", what_kind: "вечернее", object: "платье" } },
      { id: 2, correct: { who: "бабушка", verb: "варит", what_kind: "вишневое", object: "варенье" } },
      { id: 3, correct: { who: "тренер", verb: "придумывает", what_kind: "новое", object: "упражнение" } },
      { id: 4, correct: { who: "повар", verb: "готовит", what_kind: "изысканное", object: "блюдо" } },
      { id: 5, correct: { who: "кошка", verb: "лакает", what_kind: "тёплое", object: "молоко" } },
      { id: 6, correct: { who: "горничная", verb: "меняет", what_kind: "постельное", object: "бельё" } },
    ],
  },
  {
    id: 7,
    hints: ["Кто?", "Что делает?", "Что?", "Из чего?"],
    phrases: [
      { id: 1, correct: { who: "девушка", verb: "выжимает", object: "сок", from_what: "из апельсина" } },
      { id: 2, correct: { who: "портной", verb: "шьёт", object: "пиджак", from_what: "из шерсти" } },
      { id: 3, correct: { who: "строитель", verb: "строит", object: "дом", from_what: "из кирпича" } },
      { id: 4, correct: { who: "дети", verb: "делают", object: "поделки", from_what: "из бумаги" } },
      { id: 5, correct: { who: "повар", verb: "варит", object: "кашу", from_what: "из овса" } },
      { id: 6, correct: { who: "хозяйка", verb: "готовит", object: "салат", from_what: "из овощей" } },
    ],
  },
  {
    id: 8,
    hints: ["Кто?", "Что делает?", "Что?", "Из чего?"],
    phrases: [
      { id: 1, correct: { who: "огородник", verb: "поливает", object: "огурцы", tool: "из лейки" } },
      { id: 2, correct: { who: "бабушка", verb: "вяжет", object: "носки", from_what: "из шерсти" } },
      { id: 3, correct: { who: "девушка", verb: "плетёт", object: "венок", from_what: "из цветов" } },
      { id: 4, correct: { who: "рыбак", verb: "варит", object: "уху", from_what: "из щуки" } },
      { id: 5, correct: { who: "дети", verb: "лепят", object: "бабу", from_what: "из снега" } },
      { id: 6, correct: { who: "ювелир", verb: "изготавливает", object: "серьги", from_what: "из серебра" } },
    ],
  },
  {
    id: 9,
    hints: ["Кто?", "Что делает?", "Что?", "Где?"],
    phrases: [
      { id: 1, correct: { who: "пекарь", verb: "печёт", object: "булочки", place: "в пекарне" } },
      { id: 2, correct: { who: "мальчик", verb: "ищет", object: "ракушки", place: "в море" } },
      { id: 3, correct: { who: "мама", verb: "покупает", object: "продукты", place: "в супермаркете" } },
      { id: 4, correct: { who: "турист", verb: "ставит", object: "палатку", place: "в лесу" } },
      { id: 5, correct: { who: "контролёр", verb: "проверяет", object: "билеты", place: "в автобусе" } },
      { id: 6, correct: { who: "фермер", verb: "собирает", object: "черешню", place: "в саду" } },
    ],
  },
  {
    id: 10,
    hints: ["Кто?", "Как?", "Что делает?", "Что?"],
    phrases: [
      { id: 1, correct: { who: "хозяйка", how: "мелко", verb: "трёт", object: "морковь" } },
      { id: 2, correct: { who: "девочка", how: "аккуратно", verb: "пришивает", object: "пуговицу" } },
      { id: 3, correct: { who: "пассажиры", how: "долго", verb: "ждут", object: "автобус" } },
      { id: 4, correct: { who: "ученик", how: "правильно", verb: "решает", object: "задачу" } },
      { id: 5, correct: { who: "командир", how: "громко", verb: "выкрикивает", object: "команды" } },
      { id: 6, correct: { who: "спортсмен", how: "залпом", verb: "пьёт", object: "воду" } },
    ],
  },
  {
    id: 11,
    hints: ["Кто?", "Что делает?", "Что?", "Чем?"],
    phrases: [
      { id: 1, correct: { who: "кошка", verb: "царапает", object: "диван", tool: "когтями" } },
      { id: 2, correct: { who: "маляр", verb: "красит", object: "стены", tool: "валиком" } },
      { id: 3, correct: { who: "повар", verb: "разливает", object: "суп", tool: "половником" } },
      { id: 4, correct: { who: "футболист", verb: "забил", object: "мяч", tool: "головой" } },
      { id: 5, correct: { who: "работница", verb: "срезает", object: "пшеницу", tool: "серпом" } },
      { id: 6, correct: { who: "мальчик", verb: "вытирает", object: "руки", tool: "полотенцем" } },
    ],
  },
  {
    id: 12,
    hints: ["Кто?", "Что делает?", "Что?", "Где?"],
    phrases: [
      { id: 1, correct: { who: "мужчина", verb: "хранит", object: "деньги", place: "в банке" } },
      { id: 2, correct: { who: "солдат", verb: "чистит", object: "ружьё", place: "в арсенале" } },
      { id: 3, correct: { who: "врач", verb: "проверяет", object: "зрение", place: "в кабинете" } },
      { id: 4, correct: { who: "ветеринар", verb: "лечит", object: "собаку", place: "в клинике" } },
      { id: 5, correct: { who: "девушка", verb: "читает", object: "статью", place: "в журнале" } },
      { id: 6, correct: { who: "ёж", verb: "ищет", object: "пищу", place: "в лесу" } },
    ],
  },
  {
    id: 13,
    hints: ["Кто?", "Что делает?", "Что?", "Где?"],
    phrases: [
      { id: 1, correct: { who: "цветочница", verb: "продаёт", object: "цветы", place: "на площади" } },
      { id: 2, correct: { who: "бабушка", verb: "выращивает", object: "зелень", place: "на балконе" } },
      { id: 3, correct: { who: "рыбак", verb: "ловит", object: "рыбу", place: "на озере" } },
      { id: 4, correct: { who: "туристы", verb: "поют", object: "песни", place: "на поляне" } },
      { id: 5, correct: { who: "утки", verb: "вьют", object: "гнездо", place: "на крыше" } },
      { id: 6, correct: { who: "дирижер", verb: "дирижирует", object: "хором", place: "на сцене" } },
    ],
  },
  {
    id: 14,
    hints: ["Кто?", "Что делает?", "Что?", "Чем?"],
    phrases: [
      { id: 1, correct: { who: "санитар", verb: "обрабатывает", object: "рану", tool: "йодом" } },
      { id: 2, correct: { who: "рабочий", verb: "копает", object: "колодец", tool: "лопатой" } },
      { id: 3, correct: { who: "маляр", verb: "разбавляет", object: "краску", tool: "водой" } },
      { id: 4, correct: { who: "хозяйка", verb: "прикрывает", object: "окно", tool: "занавеской" } },
      { id: 5, correct: { who: "горничная", verb: "протирает", object: "зеркало", tool: "тряпкой" } },
      { id: 6, correct: { who: "повар", verb: "приправляет", object: "блюдо", tool: "перцем" } },
    ],
  },
  {
    id: 15,
    hints: ["Кто?", "Что делает?", "Что?", "Где?"],
    phrases: [
      { id: 1, correct: { who: "пастух", verb: "пасёт", object: "стадо", place: "в долине" } },
      { id: 2, correct: { who: "учёный", verb: "проводит", object: "опыты", place: "в лаборатории" } },
      { id: 3, correct: { who: "мужчина", verb: "заказывает", object: "суп", place: "в ресторане" } },
      { id: 4, correct: { who: "девушка", verb: "делает", object: "прическу", place: "в салоне" } },
      { id: 5, correct: { who: "столяр", verb: "выпиливает", object: "деталь", place: "в цехе" } },
      { id: 6, correct: { who: "пенсионер", verb: "получает", object: "пенсию", place: "в банке" } },
    ],
  },
  {
    id: 16,
    hints: ["Кто?", "Что сделал?", "Что?", "Куда?"],
    phrases: [
      { id: 1, correct: { who: "юноша", verb: "выкинул", object: "банку", where_to: "в урну" } },
      { id: 2, correct: { who: "мужчина", verb: "убрал", object: "чемодан", where_to: "в багажник" } },
      { id: 3, correct: { who: "рабочий", verb: "спрятал", object: "пропуск", where_to: "в карман" } },
      { id: 4, correct: { who: "повар", verb: "добавил", object: "майонез", where_to: "в салат" } },
      { id: 5, correct: { who: "мальчик", verb: "вложил", object: "закладку", where_to: "в книгу" } },
      { id: 6, correct: { who: "садовод", verb: "пересадил", object: "цветок", where_to: "в горшок" } },
    ],
  },
  {
    id: 17,
    hints: ["Кто?", "Что делает?", "Что?", "Куда?"],
    phrases: [
      { id: 1, correct: { who: "белка", verb: "несёт", object: "жёлудь", where_to: "в дупло" } },
      { id: 2, correct: { who: "покупатель", verb: "складывает", object: "продукты", where_to: "в пакет" } },
      { id: 3, correct: { who: "девушка", verb: "опускает", object: "письмо", where_to: "в ящик" } },
      { id: 4, correct: { who: "хозяйка", verb: "ставит", object: "молоко", where_to: "в холодильник" } },
      { id: 5, correct: { who: "врач", verb: "приглашает", object: "пациента", where_to: "в кабинет" } },
      { id: 6, correct: { who: "повар", verb: "добавляет", object: "грибы", where_to: "в суп" } },
    ],
  },
  {
    id: 18,
    hints: ["Кто?", "Что делает?", "Что?", "Куда?"],
    phrases: [
      { id: 1, correct: { who: "проводник", verb: "несёт", object: "чай", where_to: "в купе" } },
      { id: 2, correct: { who: "доярка", verb: "наливает", object: "молоко", where_to: "в кувшин" } },
      { id: 3, correct: { who: "дама", verb: "кладёт", object: "перчатки", where_to: "в сумку" } },
      { id: 4, correct: { who: "уборщица", verb: "наливает", object: "воду", where_to: "в ведро" } },
      { id: 5, correct: { who: "ребёнок", verb: "покупает", object: "билеты", where_to: "в зоопарк" } },
      { id: 6, correct: { who: "мама", verb: "убирает", object: "туфли", where_to: "в шкаф" } },
    ],
  },
  {
    id: 19,
    hints: ["Кто?", "Что делает?", "Что?", "Куда?"],
    phrases: [
      { id: 1, correct: { who: "ученик", verb: "кладёт", object: "тетрадку", where_to: "в портфель" } },
      { id: 2, correct: { who: "рыбак", verb: "закидывает", object: "удочку", where_to: "в реку" } },
      { id: 3, correct: { who: "скрипач", verb: "убирает", object: "скрипку", where_to: "в футляр" } },
      { id: 4, correct: { who: "водитель", verb: "везёт", object: "апельсины", where_to: "в магазин" } },
      { id: 5, correct: { who: "носильщик", verb: "заносит", object: "багаж", where_to: "в вагон" } },
      { id: 6, correct: { who: "девушка", verb: "сдаёт", object: "билеты", where_to: "в кассу" } },
    ],
  },
  {
    id: 20,
    hints: ["Кто?", "Что делает?", "Что?", "Кому?"],
    phrases: [
      { id: 1, correct: { who: "мама", verb: "плетёт", object: "косы", whom: "девочке" } },
      { id: 2, correct: { who: "хозяин", verb: "бросает", object: "палку", whom: "собаке" } },
      { id: 3, correct: { who: "министр", verb: "вручает", object: "медаль", whom: "герою" } },
      { id: 4, correct: { who: "девочка", verb: "наливает", object: "молоко", whom: "котёнку" } },
      { id: 5, correct: { who: "кассир", verb: "выдаёт", object: "чек", whom: "покупателю" } },
      { id: 6, correct: { who: "бабушка", verb: "читает", object: "сказку", whom: "внуку" } },
    ],
  },
  {
    id: 21,
    hints: ["Кто?", "Что делает?", "Что?", "Кому?"],
    phrases: [
      { id: 1, correct: { who: "папа", verb: "покупает", object: "мороженое", whom: "детям" } },
      { id: 2, correct: { who: "парикмахер", verb: "делает", object: "прическу", whom: "клиенту" } },
      { id: 3, correct: { who: "собака", verb: "приносит", object: "тапочки", whom: "хозяину" } },
      { id: 4, correct: { who: "ученик", verb: "дарит", object: "букет", whom: "учителю" } },
      { id: 5, correct: { who: "врач", verb: "выписывает", object: "лекарство", whom: "пациенту" } },
      { id: 6, correct: { who: "профессор", verb: "читает", object: "лекцию", whom: "студентам" } },
    ],
  },
  {
    id: 22,
    hints: ["Кто?", "Что делает?", "Что?", "Где?"],
    phrases: [
      { id: 1, correct: { who: "хозяйка", verb: "стирает", object: "бельё", place: "в тазу" } },
      { id: 2, correct: { who: "бабушка", verb: "хранит", object: "документы", place: "в комоде" } },
      { id: 3, correct: { who: "электрик", verb: "чинит", object: "проводку", place: "в доме" } },
      { id: 4, correct: { who: "девочка", verb: "срывает", object: "вишни", place: "в саду" } },
      { id: 5, correct: { who: "певица", verb: "исполняет", object: "арию", place: "в театре" } },
      { id: 6, correct: { who: "охотник", verb: "выслеживает", object: "оленя", place: "в лесу" } },
    ],
  },
  {
    id: 23,
    hints: ["Где?", "Кто?", "Что делает?", "Что?"],
    phrases: [
      { id: 1, correct: { where: "в ателье", who: "портной", verb: "снимает", object: "мерки" } },
      { id: 2, correct: { where: "в гостиной", who: "папа", verb: "смотрит", object: "телевизор" } },
      { id: 3, correct: { where: "в лесу", who: "егорь", verb: "собирает", object: "чернику" } },
      { id: 4, correct: { where: "в театре", who: "актёр", verb: "репетирует", object: "пьесу" } },
      { id: 5, correct: { where: "в кабинете", who: "стоматолог", verb: "лечит", object: "зуб" } },
      { id: 6, correct: { where: "в самолете", who: "стюардесса", verb: "предлагает", object: "напитки" } },
    ],
  },
  {
    id: 24,
    hints: ["Когда?", "Кто?", "Что делает?", "Что?"],
    phrases: [
      { id: 1, correct: { when: "осенью", who: "фермер", verb: "собирает", object: "урожай" } },
      { id: 2, correct: { when: "утром", who: "девочка", verb: "делает", object: "зарядку" } },
      { id: 3, correct: { when: "зимой", who: "заяц", verb: "грызёт", object: "кору" } },
      { id: 4, correct: { when: "днем", who: "бабушка", verb: "готовит", object: "обед" } },
      { id: 5, correct: { when: "ночью", who: "сторож", verb: "обходит", object: "склад" } },
      { id: 6, correct: { when: "весной", who: "птица", verb: "вьёт", object: "гнездо" } },
    ],
  },
  {
    id: 25,
    hints: ["Кто?", "Что делает?", "Какой?", "Что?"],
    phrases: [
      { id: 1, correct: { who: "девочка", verb: "пьёт", what_kind: "томатный", object: "сок" } },
      { id: 2, correct: { who: "хозяйка", verb: "готовит", what_kind: "крабовый", object: "салат" } },
      { id: 3, correct: { who: "грузчик", verb: "несёт", what_kind: "тяжёлый", object: "ящик" } },
      { id: 4, correct: { who: "композитор", verb: "сочиняет", what_kind: "праздничный", object: "марш" } },
      { id: 5, correct: { who: "шахтёр", verb: "добывает", what_kind: "каменный", object: "уголь" } },
      { id: 6, correct: { who: "школьник", verb: "изучает", what_kind: "английский", object: "язык" } },
    ],
  },
  {
    id: 26,
    hints: ["Кто?", "Что делает?", "Что?", "С чем?"],
    phrases: [
      { id: 1, correct: { who: "мама", verb: "покупает", object: "кофту", with_what: "с капюшоном" } },
      { id: 2, correct: { who: "мальчик", verb: "ест", object: "гречку", with_what: "с котлетами" } },
      { id: 3, correct: { who: "булочник", verb: "продает", object: "булочки", with_what: "с малиной" } },
      { id: 4, correct: { who: "женщина", verb: "примеряет", object: "блузку", with_what: "с кружевом" } },
      { id: 5, correct: { who: "посетитель", verb: "пьёт", object: "кофе", with_what: "со сливками" } },
      { id: 6, correct: { who: "фермер", verb: "несёт", object: "корзину", with_what: "с яблоками" } },
    ],
  },
  {
    id: 27,
    hints: ["Кто?", "Что делает?", "Что?", "На что?"],
    phrases: [
      { id: 1, correct: { who: "мальчик", verb: "кидает", object: "рубашку", on_what: "на стул" } },
      { id: 2, correct: { who: "девушка", verb: "надевает", object: "перчатки", on_what: "на руки" } },
      { id: 3, correct: { who: "мужчина", verb: "покупает", object: "билеты", on_what: "на концерт" } },
      { id: 4, correct: { who: "женщина", verb: "ставит", object: "ведро", on_what: "на землю" } },
      { id: 5, correct: { who: "игрок", verb: "выкладывает", object: "карты", on_what: "на стол" } },
      { id: 6, correct: { who: "рабочий", verb: "вешает", object: "картину", on_what: "на стену" } },
    ],
  },
  {
    id: 28,
    hints: ["Кто?", "Что делает?", "Что?", "Кому?"],
    phrases: [
      { id: 1, correct: { who: "мама", verb: "готовит", object: "кашу", whom: "сыну" } },
      { id: 2, correct: { who: "учитель", verb: "объясняет", object: "задачу", whom: "школьникам" } },
      { id: 3, correct: { who: "муж", verb: "несёт", object: "букет", whom: "жене" } },
      { id: 4, correct: { who: "студент", verb: "задаёт", object: "вопрос", whom: "профессору" } },
      { id: 5, correct: { who: "юноша", verb: "пишет", object: "письмо", whom: "другу" } },
      { id: 6, correct: { who: "врач", verb: "измеряет", object: "давление", whom: "пациенту" } },
    ],
  },
  {
    id: 29,
    hints: ["Кто?", "Что делает?", "Что?", "Чем?"],
    phrases: [
      { id: 1, correct: { who: "кондитер", verb: "украшает", object: "торт", tool: "фруктами" } },
      { id: 2, correct: { who: "мальчик", verb: "вытирает", object: "губы", tool: "салфеткой" } },
      { id: 3, correct: { who: "девушка", verb: "наполняет", object: "ванну", tool: "водой" } },
      { id: 4, correct: { who: "чертежник", verb: "чертит", object: "схему", tool: "карандашом" } },
      { id: 5, correct: { who: "бабушка", verb: "закрывает", object: "банку", tool: "крышкой" } },
      { id: 6, correct: { who: "папа", verb: "надувает", object: "матрас", tool: "насосом" } },
    ],
  },
  {
    id: 30,
    hints: ["Кто?", "Что делает?", "Что?", "На что?"],
    phrases: [
      { id: 1, correct: { who: "продавщица", verb: "кладёт", object: "сдачу", on_what: "на прилавок" } },
      { id: 2, correct: { who: "повар", verb: "ставит", object: "кастрюлю", on_what: "на плиту" } },
      { id: 3, correct: { who: "девушка", verb: "наклеивает", object: "марку", on_what: "на конверт" } },
      { id: 4, correct: { who: "дачник", verb: "вешает", object: "качели", on_what: "на дерево" } },
      { id: 5, correct: { who: "ребенок", verb: "выливает", object: "краску", on_what: "на пол" } },
      { id: 6, correct: { who: "библиотекарь", verb: "ставит", object: "книгу", on_what: "на полку" } },
    ],
  },
];

const HINT_TO_KEYS: Record<string, PhraseRole[]> = {
  "Кто?": ["who"],
  "Что делает?": ["verb"],
  "Что сделал?": ["verb"],
  "Что?": ["object"],
  "Чем?": ["tool"],
  "Где?": ["place", "where"],
  "Кому?": ["whom"],
  "Куда?": ["where_to"],
  "Из чего?": ["from_what", "tool"],
  "Какой?": ["what_kind"],
  "Какая?": ["what_kind"],
  "Какое?": ["what_kind"],
  "Какую?": ["what_kind"],
  "Как?": ["how"],
  "Когда?": ["when"],
  "С чем?": ["with_what"],
  "На что?": ["on_what"],
};

export function valueForHint(correct: PhraseAssemblyPhrase["correct"], hint: string): string {
  const keys = HINT_TO_KEYS[hint];
  if (!keys) return "";
  for (const key of keys) {
    const v = correct[key];
    if (v) return v;
  }
  return "";
}

export function expectedWords(correct: PhraseAssemblyPhrase["correct"], hints: string[]): string[] {
  return hints.map((h) => valueForHint(correct, h));
}
