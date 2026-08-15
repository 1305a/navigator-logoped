export interface ParonymRow {
  id: number;
  phrase: string;
  value: string;
}

export interface ParonymTask {
  id: number;
  phrases: ParonymRow[];
}

export const paronymTasks: ParonymTask[] = [
  {
    id: 1,
    phrases: [
      { id: 1, phrase: "КОРЕННОЙ", value: "ЗУБ" },
      { id: 2, phrase: "КОРНЕВОЙ", value: "КАТАЛОГ" },
      { id: 3, phrase: "ЛИСТВЕННЫЙ", value: "ЛЕС" },
      { id: 4, phrase: "ЛИСТОВОЙ", value: "ЧАЙ" },
      { id: 5, phrase: "ЦВЕТНОЙ", value: "ТЕЛЕВИЗОР" },
      { id: 6, phrase: "ЦВЕТОЧНЫЙ", value: "ГОРШОК" },
      { id: 7, phrase: "КОСТЯНОЙ", value: "ФАРФОР" },
      { id: 8, phrase: "КОСТНЫЙ", value: "МОЗГ" },
    ],
  },
  {
    id: 2,
    phrases: [
      { id: 1, phrase: "ЗВУКОВОЙ", value: "СИГНАЛ" },
      { id: 2, phrase: "ЗВУЧНЫЙ", value: "ГОЛОС" },
      { id: 3, phrase: "ЗАРАЗНЫЙ", value: "ВИРУС" },
      { id: 4, phrase: "ЗАРАЗИТЕЛЬНЫЙ", value: "СМЕХ" },
      { id: 5, phrase: "ИМЕННОЙ", value: "ПИСТОЛЕТ" },
      { id: 6, phrase: "ИМЕНИТЫЙ", value: "ХУДОЖНИК" },
      { id: 7, phrase: "КЛЕТОЧНЫЙ", value: "ОБМЕН" },
      { id: 8, phrase: "КЛЕТЧАТЫЙ", value: "ПЛЕД" },
    ],
  },
  {
    id: 3,
    phrases: [
      { id: 1, phrase: "ЖЕНСКАЯ", value: "ОДЕЖДА" },
      { id: 2, phrase: "ЖЕНСТВЕННАЯ", value: "ПОХОДКА" },
      { id: 3, phrase: "ГУБАСТАЯ", value: "ОБЕЗЬЯНА" },
      { id: 4, phrase: "ГУБНАЯ", value: "ГАРМОШКА" },
      { id: 5, phrase: "ЛОБНАЯ", value: "КОСТЬ" },
      { id: 6, phrase: "ЛОБОВАЯ", value: "АТАКА" },
      { id: 7, phrase: "ВОЛОСАТАЯ", value: "ГРУДЬ" },
      { id: 8, phrase: "ВОЛОСЯНАЯ", value: "ЛУКОВИЦА" },
    ],
  },
  {
    id: 4,
    phrases: [
      { id: 1, phrase: "КУЛАЦКИЙ", value: "СЫН" },
      { id: 2, phrase: "КУЛАЧНЫЙ", value: "БОЙ" },
      { id: 3, phrase: "ЛИЧНЫЙ", value: "АВТОМОБИЛЬ" },
      { id: 4, phrase: "ЛИЦЕВОЙ", value: "НЕРВ" },
      { id: 5, phrase: "ЗУБНОЙ", value: "НАЛЁТ" },
      { id: 6, phrase: "ЗУБАСТЫЙ", value: "КРОКОДИЛ" },
      { id: 7, phrase: "БЫВШИЙ", value: "МУЖ" },
      { id: 8, phrase: "БЫВАЛЫЙ", value: "РЫБАК" },
    ],
  },
  {
    id: 5,
    phrases: [
      { id: 1, phrase: "ВОРОНИЙ", value: "КЛЮВ" },
      { id: 2, phrase: "ВОРОНОЙ", value: "КОНЬ" },
      { id: 3, phrase: "ГЕНЕРАЛЬНЫЙ", value: "ДИРЕКТОР" },
      { id: 4, phrase: "ГЕНЕРАЛЬСКИЙ", value: "МУНДИР" },
      { id: 5, phrase: "ГОРЮЧИЙ", value: "ШНУР" },
      { id: 6, phrase: "ГОРЯЧИЙ", value: "УТЮГ" },
      { id: 7, phrase: "ЗЕРНОВОЙ", value: "КОФЕ" },
      { id: 8, phrase: "ЗЕРНИСТЫЙ", value: "ТВОРОГ" },
    ],
  },
  {
    id: 6,
    phrases: [
      { id: 1, phrase: "ИГРИСТОЕ", value: "ВИНО" },
      { id: 2, phrase: "ИГРОВОЕ", value: "ПОЛЕ" },
      { id: 3, phrase: "КОЖНОЕ", value: "ЗАБОЛЕВАНИЕ" },
      { id: 4, phrase: "КОЖАНОЕ", value: "КРЕСЛО" },
      { id: 5, phrase: "МАСЛЯНОЕ", value: "ПЯТНО" },
      { id: 6, phrase: "МАСЛИЧНОЕ", value: "РАСТЕНИЕ" },
      { id: 7, phrase: "ЭФФЕКТНОЕ", value: "ПОЯВЛЕНИЕ" },
      { id: 8, phrase: "ЭФФЕКТИВНОЕ", value: "УПРАВЛЕНИЕ" },
    ],
  },
  {
    id: 7,
    phrases: [
      { id: 1, phrase: "ЗАВОДНАЯ", value: "ИГРУШКА" },
      { id: 2, phrase: "ЗАВОДСКАЯ", value: "СТОЛОВАЯ" },
      { id: 3, phrase: "ЕЛОВАЯ", value: "ШИШКА" },
      { id: 4, phrase: "ЕЛОЧНАЯ", value: "ИГРУШКА" },
      { id: 5, phrase: "ДУШЕВАЯ", value: "КАБИНА" },
      { id: 6, phrase: "ДУШИСТАЯ", value: "СИРЕНЬ" },
      { id: 7, phrase: "ДОЖДЕВАЯ", value: "ВОДА" },
      { id: 8, phrase: "ДОЖДЛИВАЯ", value: "ПОГОДА" },
    ],
  },
  {
    id: 8,
    phrases: [
      { id: 1, phrase: "ЯБЛОЧНЫЙ", value: "СОК" },
      { id: 2, phrase: "ЯБЛОНЕВЫЙ", value: "САД" },
      { id: 3, phrase: "СЪЕМНЫЙ", value: "ПРОТЕЗ" },
      { id: 4, phrase: "СЪЕМОЧНЫЙ", value: "ДЕНЬ" },
      { id: 5, phrase: "РЫБИЙ", value: "ГЛАЗ" },
      { id: 6, phrase: "РЫБНЫЙ", value: "СУП" },
      { id: 7, phrase: "РУССКИЙ", value: "ЯЗЫК" },
      { id: 8, phrase: "РОССИЙСКИЙ", value: "ФЛАГ" },
    ],
  },
  {
    id: 9,
    phrases: [
      { id: 1, phrase: "ПРОДУКТИВНЫЙ", value: "ДИАЛОГ" },
      { id: 2, phrase: "ПРОДУКТОВЫЙ", value: "МАГАЗИН" },
      { id: 3, phrase: "СКЛАДНОЙ", value: "НОЖ" },
      { id: 4, phrase: "СКЛАДСКОЙ", value: "РАБОТНИК" },
      { id: 5, phrase: "ОТЧЁТНЫЙ", value: "КОНЦЕРТ" },
      { id: 6, phrase: "ОТЧЁТЛИВЫЙ", value: "СЛЕД" },
      { id: 7, phrase: "КАМЕННЫЙ", value: "МОСТ" },
      { id: 8, phrase: "КАМЕНИСТЫЙ", value: "СКЛОН" },
    ],
  },
];
