export interface AdjNounPhrase {
  id: number;
  phrase: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface AdjNounTask {
  id: number;
  phrases: AdjNounPhrase[];
}

const imageModules = import.meta.glob("../assets/adjective-noun/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/adjective-noun/audio/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(taskId: number, phraseId: number): string | undefined {
  const suffix = `/${taskId}_${phraseId}.png`;
  const key = Object.keys(imageModules).find((k) => k.endsWith(suffix));
  return key ? imageModules[key] : undefined;
}

function resolveAudio(taskId: number, phraseId: number): string | undefined {
  const suffix = `/${taskId}_${phraseId}.mp3`;
  const key = Object.keys(audioModules).find((k) => k.endsWith(suffix));
  return key ? audioModules[key] : undefined;
}

function buildTask(id: number, phrases: string[]): AdjNounTask {
  return {
    id,
    phrases: phrases.map((phrase, i) => {
      const phraseId = i + 1;
      return {
        id: phraseId,
        phrase,
        audioUrl: resolveAudio(id, phraseId),
        imageUrl: resolveImage(id, phraseId),
      };
    }),
  };
}

export const adjNounTasks: AdjNounTask[] = [
  buildTask(1, ["яркое солнце", "зелёный огурец", "грозовая туча", "яркая лампочка"]),
  buildTask(2, ["весёлый клоун", "серый волк", "грустный скрипач", "весёлый дедушка"]),
  buildTask(3, ["фарфоровая чашка", "кирпичный дом", "железная миска", "фарфоровая ваза"]),
  buildTask(4, ["стеклянная бутылка", "бумажная салфетка", "глиняный кувшин", "стеклянное окно"]),
  buildTask(5, ["грязная кофта", "плетеная корзина", "чистая рубашка", "грязные ботинки"]),
  buildTask(6, ["белый лебедь", "наручные часы", "чёрный грач", "белая берёза"]),
  buildTask(7, ["спелое яблоко", "синяя книга", "зелёная клубника", "спелый перец"]),
  buildTask(8, ["новогодняя ёлка", "кожаная сумка", "финиковая пальма", "новогодний салют"]),
  buildTask(9, ["сладкая малина", "воздушный шар", "кислый лимон", "сладкое варенье"]),
  buildTask(10, ["складной стул", "золотое кольцо", "раскладной диван", "складной нож"]),
  buildTask(11, ["колючий ёж", "соломенная шляпа", "пушистый кот", "колючий кактус"]),
  buildTask(12, ["высокая сосна", "широкая дорога", "низкая трава", "высокая башня"]),
  buildTask(13, ["спортивный костюм", "речная рыба", "бальное платье", "спортивный велосипед"]),
  buildTask(14, ["чайная ложка", "красный мак", "столовая вилка", "чайный пакетик"]),
  buildTask(15, ["шариковая ручка", "книжная полка", "простой карандаш", "шариковый дезодорант"]),
];
