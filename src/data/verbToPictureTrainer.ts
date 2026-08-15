export interface VerbPictureItem {
  imageUrl?: string;
  subject: string;
  object: string;
  correctVerb: string;
}

export interface VerbPictureTask {
  items: VerbPictureItem[];
}

export interface VerbPictureLevel {
  level: number;
  tasks: VerbPictureTask[];
}

const imageModules = import.meta.glob("../assets/verb-to-picture/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(fileName: string): string | undefined {
  const key = Object.keys(imageModules).find((k) => k.endsWith(`/${fileName}`));
  return key ? imageModules[key] : undefined;
}

type RawItem = { image: string; sentence: [string, string, string]; correct: string };
type RawTask = { items: RawItem[] };

const L1: RawTask[] = [
  { items: [{ image: "1.png", sentence: ["Швея", "", "платье"], correct: "шьёт" }, { image: "2.png", sentence: ["Грузчик", "", "коробку"], correct: "несёт" }] },
  { items: [{ image: "7.png", sentence: ["Бабушка", "", "носки"], correct: "вяжет" }, { image: "8.png", sentence: ["Таксист", "", "пассажиров"], correct: "везёт" }] },
  { items: [{ image: "13.png", sentence: ["Девочка", "", "цветы"], correct: "вышивает" }, { image: "14.png", sentence: ["Дедушка", "", "телевизор"], correct: "смотрит" }] },
  { items: [{ image: "19.png", sentence: ["Юноша", "", "объявление"], correct: "клеит" }, { image: "20.png", sentence: ["Мужчина", "", "бочку"], correct: "катит" }] },
  { items: [{ image: "25.png", sentence: ["Мужчина", "", "шляпу"], correct: "надевает" }, { image: "26.png", sentence: ["Женщина", "", "бельё"], correct: "вешает" }] },
  { items: [{ image: "31.png", sentence: ["Слесарь", "", "машину"], correct: "чинит" }, { image: "32.png", sentence: ["Каменщик", "", "кирпич"], correct: "кладёт" }] },
  { items: [{ image: "37.png", sentence: ["Девушка", "", "обруч"], correct: "крутит" }, { image: "38.png", sentence: ["Грибник", "", "грибы"], correct: "собирает" }] },
  { items: [{ image: "43.png", sentence: ["Бабушка", "", "внука"], correct: "одевает" }, { image: "44.png", sentence: ["Вор", "", "кошелёк"], correct: "крадёт" }] },
  { items: [{ image: "49.png", sentence: ["Рабочий", "", "яму"], correct: "копает" }, { image: "50.png", sentence: ["Женщина", "", "продукты"], correct: "покупает" }] },
  { items: [{ image: "55.png", sentence: ["Юноша", "", "лицо"], correct: "вытирает" }, { image: "56.png", sentence: ["Женщина", "", "воду"], correct: "черпает" }] },
  { items: [{ image: "61.png", sentence: ["Девушка", "", "бельё"], correct: "гладит" }, { image: "62.png", sentence: ["Собака", "", "руку"], correct: "лижет" }] },
  { items: [{ image: "67.png", sentence: ["Птица", "", "гнездо"], correct: "вьёт" }, { image: "68.png", sentence: ["Уборщица", "", "тряпку"], correct: "выжимает" }] },
  { items: [{ image: "73.png", sentence: ["Хозяйка", "", "гостей"], correct: "угощает" }, { image: "74.png", sentence: ["Школьник", "", "пенсионера"], correct: "переводит" }] },
  { items: [{ image: "79.png", sentence: ["Девушка", "", "свет"], correct: "выключает" }, { image: "80.png", sentence: ["Женщина", "", "морковь"], correct: "трёт" }] },
  { items: [{ image: "85.png", sentence: ["Дети", "", "ёлку"], correct: "наряжают" }, { image: "86.png", sentence: ["Кузнец", "", "подкову"], correct: "куёт" }] },
];

const L2: RawTask[] = [
  { items: [{ image: "1.png", sentence: ["Швея", "", "платье"], correct: "шьёт" }, { image: "2.png", sentence: ["Грузчик", "", "коробку"], correct: "несёт" }, { image: "3.png", sentence: ["Мальчик", "", "письмо"], correct: "пишет" }, { image: "4.png", sentence: ["Девочка", "", "пирожок"], correct: "ест" }] },
  { items: [{ image: "7.png", sentence: ["Бабушка", "", "носки"], correct: "вяжет" }, { image: "8.png", sentence: ["Таксист", "", "пассажиров"], correct: "везёт" }, { image: "9.png", sentence: ["Дедушка", "", "газету"], correct: "читает" }, { image: "10.png", sentence: ["Девушка", "", "кофе"], correct: "пьёт" }] },
  { items: [{ image: "13.png", sentence: ["Девочка", "", "цветы"], correct: "вышивает" }, { image: "14.png", sentence: ["Дедушка", "", "телевизор"], correct: "смотрит" }, { image: "15.png", sentence: ["Ученик", "", "пример"], correct: "решает" }, { image: "16.png", sentence: ["Женщина", "", "чай"], correct: "наливает" }] },
  { items: [{ image: "19.png", sentence: ["Юноша", "", "объявление"], correct: "клеит" }, { image: "20.png", sentence: ["Мужчина", "", "бочку"], correct: "катит" }, { image: "21.png", sentence: ["Инженер", "", "схему"], correct: "чертит" }, { image: "22.png", sentence: ["Поэт", "", "стихи"], correct: "сочиняет" }] },
  { items: [{ image: "25.png", sentence: ["Мужчина", "", "шляпу"], correct: "надевает" }, { image: "26.png", sentence: ["Женщина", "", "бельё"], correct: "вешает" }, { image: "27.png", sentence: ["Художник", "", "картину"], correct: "рисует" }, { image: "28.png", sentence: ["Бабушка", "", "пирог"], correct: "печёт" }] },
  { items: [{ image: "31.png", sentence: ["Слесарь", "", "машину"], correct: "чинит" }, { image: "32.png", sentence: ["Каменщик", "", "кирпич"], correct: "кладёт" }, { image: "33.png", sentence: ["Дети", "", "снеговика"], correct: "лепят" }, { image: "34.png", sentence: ["Женщина", "", "масло"], correct: "мажет" }] },
  { items: [{ image: "37.png", sentence: ["Девушка", "", "обруч"], correct: "крутит" }, { image: "38.png", sentence: ["Грибник", "", "грибы"], correct: "собирает" }, { image: "39.png", sentence: ["Мама", "", "сына"], correct: "зовёт" }, { image: "40.png", sentence: ["Парень", "", "девушку"], correct: "ждёт" }] },
  { items: [{ image: "43.png", sentence: ["Бабушка", "", "внука"], correct: "одевает" }, { image: "44.png", sentence: ["Вор", "", "кошелёк"], correct: "крадёт" }, { image: "45.png", sentence: ["Мужчина", "", "гвоздь"], correct: "забивает" }, { image: "46.png", sentence: ["Хозяйка", "", "чай"], correct: "заваривает" }] },
  { items: [{ image: "49.png", sentence: ["Рабочий", "", "яму"], correct: "копает" }, { image: "50.png", sentence: ["Женщина", "", "продукты"], correct: "покупает" }, { image: "51.png", sentence: ["Врач", "", "зубы"], correct: "лечит" }, { image: "52.png", sentence: ["Друг", "", "подарок"], correct: "дарит" }] },
  { items: [{ image: "55.png", sentence: ["Юноша", "", "лицо"], correct: "вытирает" }, { image: "56.png", sentence: ["Женщина", "", "воду"], correct: "черпает" }, { image: "57.png", sentence: ["Мужчина", "", "птиц"], correct: "выпускает" }, { image: "58.png", sentence: ["Мальчик", "", "шарик"], correct: "надувает" }] },
  { items: [{ image: "61.png", sentence: ["Девушка", "", "бельё"], correct: "гладит" }, { image: "62.png", sentence: ["Собака", "", "руку"], correct: "лижет" }, { image: "63.png", sentence: ["Маляр", "", "забор"], correct: "красит" }, { image: "64.png", sentence: ["Медсестра", "", "укол"], correct: "колет" }] },
  { items: [{ image: "67.png", sentence: ["Птица", "", "гнездо"], correct: "вьёт" }, { image: "68.png", sentence: ["Уборщица", "", "тряпку"], correct: "выжимает" }, { image: "69.png", sentence: ["Собака", "", "кость"], correct: "грызёт" }, { image: "70.png", sentence: ["Именинник", "", "свечи"], correct: "задувает" }] },
  { items: [{ image: "73.png", sentence: ["Хозяйка", "", "гостей"], correct: "угощает" }, { image: "74.png", sentence: ["Школьник", "", "пенсионера"], correct: "переводит" }, { image: "75.png", sentence: ["Бармен", "", "бутылку"], correct: "открывает" }, { image: "76.png", sentence: ["Малыш", "", "шарик"], correct: "держит" }] },
  { items: [{ image: "79.png", sentence: ["Девушка", "", "свет"], correct: "выключает" }, { image: "80.png", sentence: ["Женщина", "", "морковь"], correct: "трёт" }, { image: "81.png", sentence: ["Учитель", "", "отметку"], correct: "ставит" }, { image: "82.png", sentence: ["Руководитель", "", "ленточку"], correct: "перерезает" }] },
  { items: [{ image: "85.png", sentence: ["Дети", "", "ёлку"], correct: "наряжают" }, { image: "86.png", sentence: ["Кузнец", "", "металл"], correct: "куёт" }, { image: "87.png", sentence: ["Журналист", "", "статью"], correct: "печатает" }, { image: "88.png", sentence: ["Спасатели", "", "тонущего"], correct: "спасают" }] },
];

const L3: RawTask[] = [
  { items: [{ image: "1.png", sentence: ["Швея", "", "платье"], correct: "шьёт" }, { image: "2.png", sentence: ["Грузчик", "", "коробку"], correct: "несёт" }, { image: "3.png", sentence: ["Мальчик", "", "письмо"], correct: "пишет" }, { image: "4.png", sentence: ["Девочка", "", "пирожок"], correct: "ест" }, { image: "5.png", sentence: ["Дедушка", "", "трубку"], correct: "курит" }, { image: "6.png", sentence: ["Рабочий", "", "бревно"], correct: "пилит" }] },
  { items: [{ image: "7.png", sentence: ["Бабушка", "", "носки"], correct: "вяжет" }, { image: "8.png", sentence: ["Таксист", "", "пассажиров"], correct: "везёт" }, { image: "9.png", sentence: ["Дедушка", "", "газету"], correct: "читает" }, { image: "10.png", sentence: ["Девушка", "", "кофе"], correct: "пьёт" }, { image: "11.png", sentence: ["Женщина", "", "картошку"], correct: "чистит" }, { image: "12.png", sentence: ["Мама", "", "хлеб"], correct: "режет" }] },
  { items: [{ image: "13.png", sentence: ["Девочка", "", "цветы"], correct: "вышивает" }, { image: "14.png", sentence: ["Дедушка", "", "телевизор"], correct: "смотрит" }, { image: "15.png", sentence: ["Ученик", "", "пример"], correct: "решает" }, { image: "16.png", sentence: ["Женщина", "", "чай"], correct: "наливает" }, { image: "17.png", sentence: ["Девушка", "", "руки"], correct: "моет" }, { image: "18.png", sentence: ["Дровосек", "", "дрова"], correct: "рубит" }] },
  { items: [{ image: "19.png", sentence: ["Юноша", "", "объявление"], correct: "клеит" }, { image: "20.png", sentence: ["Мужчина", "", "бочку"], correct: "катит" }, { image: "21.png", sentence: ["Инженер", "", "схему"], correct: "чертит" }, { image: "22.png", sentence: ["Поэт", "", "стихи"], correct: "сочиняет" }, { image: "23.png", sentence: ["Туристы", "", "костёр"], correct: "разжигают" }, { image: "24.png", sentence: ["Парикмахер", "", "волосы"], correct: "стрижёт" }] },
  { items: [{ image: "25.png", sentence: ["Мужчина", "", "шляпу"], correct: "надевает" }, { image: "26.png", sentence: ["Женщина", "", "бельё"], correct: "вешает" }, { image: "27.png", sentence: ["Художник", "", "картину"], correct: "рисует" }, { image: "28.png", sentence: ["Бабушка", "", "пирог"], correct: "печёт" }, { image: "29.png", sentence: ["Девушка", "", "волосы"], correct: "расчёсывает" }, { image: "30.png", sentence: ["Ребёнок", "", "мяч"], correct: "бросает" }] },
  { items: [{ image: "31.png", sentence: ["Слесарь", "", "машину"], correct: "чинит" }, { image: "32.png", sentence: ["Каменщик", "", "кирпич"], correct: "кладёт" }, { image: "33.png", sentence: ["Дети", "", "снеговика"], correct: "лепят" }, { image: "34.png", sentence: ["Женщина", "", "масло"], correct: "мажет" }, { image: "35.png", sentence: ["Пожарный", "", "огонь"], correct: "тушит" }, { image: "36.png", sentence: ["Повар", "", "суп"], correct: "варит" }] },
  { items: [{ image: "37.png", sentence: ["Девушка", "", "обруч"], correct: "крутит" }, { image: "38.png", sentence: ["Грибник", "", "грибы"], correct: "собирает" }, { image: "39.png", sentence: ["Мама", "", "сына"], correct: "зовёт" }, { image: "40.png", sentence: ["Парень", "", "девушку"], correct: "ждёт" }, { image: "41.png", sentence: ["Дворник", "", "улицу"], correct: "метёт" }, { image: "42.png", sentence: ["Садовник", "", "яблоню"], correct: "сажает" }] },
  { items: [{ image: "43.png", sentence: ["Бабушка", "", "внука"], correct: "одевает" }, { image: "44.png", sentence: ["Вор", "", "кошелёк"], correct: "крадёт" }, { image: "45.png", sentence: ["Мужчина", "", "гвоздь"], correct: "забивает" }, { image: "46.png", sentence: ["Хозяйка", "", "чай"], correct: "заваривает" }, { image: "47.png", sentence: ["Рыбак", "", "рыбу"], correct: "ловит" }, { image: "48.png", sentence: ["Дачник", "", "цветы"], correct: "поливает" }] },
  { items: [{ image: "49.png", sentence: ["Рабочий", "", "яму"], correct: "копает" }, { image: "50.png", sentence: ["Женщина", "", "продукты"], correct: "покупает" }, { image: "51.png", sentence: ["Врач", "", "зубы"], correct: "лечит" }, { image: "52.png", sentence: ["Друг", "", "подарок"], correct: "дарит" }, { image: "53.png", sentence: ["Клоун", "", "детей"], correct: "смешит" }, { image: "54.png", sentence: ["Жених", "", "невесту"], correct: "обнимает" }] },
  { items: [{ image: "55.png", sentence: ["Юноша", "", "лицо"], correct: "вытирает" }, { image: "56.png", sentence: ["Женщина", "", "воду"], correct: "черпает" }, { image: "57.png", sentence: ["Мужчина", "", "птиц"], correct: "выпускает" }, { image: "58.png", sentence: ["Мальчик", "", "шарик"], correct: "надувает" }, { image: "59.png", sentence: ["Мама", "", "ребёнка"], correct: "кормит" }, { image: "60.png", sentence: ["Девушка", "", "волосы"], correct: "сушит" }] },
  { items: [{ image: "61.png", sentence: ["Девушка", "", "бельё"], correct: "гладит" }, { image: "62.png", sentence: ["Собака", "", "руку"], correct: "лижет" }, { image: "63.png", sentence: ["Маляр", "", "забор"], correct: "красит" }, { image: "64.png", sentence: ["Медсестра", "", "укол"], correct: "колет" }, { image: "65.png", sentence: ["Врач", "", "давление"], correct: "измеряет" }, { image: "66.png", sentence: ["Певец", "", "песню"], correct: "поёт" }] },
  { items: [{ image: "67.png", sentence: ["Птица", "", "гнездо"], correct: "вьёт" }, { image: "68.png", sentence: ["Уборщица", "", "тряпку"], correct: "выжимает" }, { image: "69.png", sentence: ["Собака", "", "кость"], correct: "грызёт" }, { image: "70.png", sentence: ["Именинник", "", "свечи"], correct: "задувает" }, { image: "71.png", sentence: ["Юноша", "", "куртку"], correct: "застёгивает" }, { image: "72.png", sentence: ["Точильщик", "", "ножи"], correct: "точит" }] },
  { items: [{ image: "73.png", sentence: ["Хозяйка", "", "гостей"], correct: "угощает" }, { image: "74.png", sentence: ["Школьник", "", "пенсионера"], correct: "переводит" }, { image: "75.png", sentence: ["Музыкант", "", "струны"], correct: "открывает" }, { image: "76.png", sentence: ["Малыш", "", "шарик"], correct: "держит" }, { image: "77.png", sentence: ["Хоккеист", "", "шайбу"], correct: "забивает" }, { image: "78.png", sentence: ["Директор", "", "документ"], correct: "подписывает" }] },
  { items: [{ image: "79.png", sentence: ["Девушка", "", "свет"], correct: "выключает" }, { image: "80.png", sentence: ["Женщина", "", "морковь"], correct: "трёт" }, { image: "81.png", sentence: ["Учитель", "", "отметку"], correct: "ставит" }, { image: "82.png", sentence: ["Руководитель", "", "ленточку"], correct: "перерезает" }, { image: "83.png", sentence: ["Шофёр", "", "машину"], correct: "заправляет" }, { image: "84.png", sentence: ["Крот", "", "землю"], correct: "роет" }] },
  { items: [{ image: "85.png", sentence: ["Дети", "", "ёлку"], correct: "наряжают" }, { image: "86.png", sentence: ["Кузнец", "", "металл"], correct: "куёт" }, { image: "87.png", sentence: ["Журналист", "", "статью"], correct: "печатает" }, { image: "88.png", sentence: ["Спасатели", "", "тонущего"], correct: "спасают" }, { image: "89.png", sentence: ["Мальчик", "", "снежинку"], correct: "вырезает" }, { image: "90.png", sentence: ["Хозяйка", "", "бельё"], correct: "стирает" }] },
];

function buildLevel(level: number, tasks: RawTask[]): VerbPictureLevel {
  return {
    level,
    tasks: tasks.map((t) => ({
      items: t.items.map((it) => ({
        imageUrl: resolveImage(it.image),
        subject: it.sentence[0],
        object: it.sentence[2],
        correctVerb: it.correct,
      })),
    })),
  };
}

export const verbPictureLevels: VerbPictureLevel[] = [buildLevel(1, L1), buildLevel(2, L2), buildLevel(3, L3)];
