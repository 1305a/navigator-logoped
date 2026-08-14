export interface PhraseBuilderPhrase {
  id: number;
  subject: string;
  verb: string;
  object: string;
  imageUrl?: string;
}

const imageModules = import.meta.glob("../assets/phrase-builder/*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(fileName: string): string | undefined {
  const key = Object.keys(imageModules).find((k) => k.endsWith(`/${fileName}`));
  return key ? imageModules[key] : undefined;
}

function buildPhrase(
  id: number,
  subject: string,
  verb: string,
  object: string,
  fileName: string,
): PhraseBuilderPhrase {
  return { id, subject, verb, object, imageUrl: resolveImage(fileName) };
}

export const phraseBuilderPhrases: PhraseBuilderPhrase[] = [
  buildPhrase(1, "Школьник", "завязывает", "шнурки", "01-schoolboy-shoelaces1.jpg"),
  buildPhrase(2, "Лошадь", "жуёт", "сено", "02-horse-hay1.jpg"),
  buildPhrase(3, "Женщина", "примеряет", "платье", "03-woman-dress1.jpg"),
  buildPhrase(4, "Машинист", "ведёт", "поезд", "04-engineer-train1.jpg"),
  buildPhrase(5, "Воспитатель", "читает", "сказку", "05-teacher-book1.jpg"),
  buildPhrase(6, "Студент", "тянет", "билет", "06-student-ticket1.jpg"),
  buildPhrase(7, "Грибник", "несёт", "корзину", "07-mushroom-picker-basket1.jpg"),
  buildPhrase(8, "Солдат", "копает", "окоп", "08-soldier-trench1.jpg"),
  buildPhrase(9, "Пекарь", "раскатывает", "тесто", "09-baker-dough1.jpg"),
  buildPhrase(10, "Бегун", "пьёт", "воду", "10-runner-water1.jpg"),
  buildPhrase(11, "Часовщик", "чинит", "часы", "11-watchmaker-watch1.jpg"),
  buildPhrase(12, "Хозяйка", "вытирает", "пыль", "12-housewife-dust1.jpg"),
  buildPhrase(13, "Кассир", "выдаёт", "чек", "13-cashier-receipt1.jpg"),
  buildPhrase(14, "Курьер", "везёт", "заказ", "14-courier-box1.jpg"),
  buildPhrase(15, "Каменщик", "кладёт", "кирпич", "15-mason-brick1.jpg"),
  buildPhrase(16, "Именинник", "задувает", "свечи", "16-birthday-candles1.jpg"),
];
