export interface VerbActionOption {
  text: string;
  audioUrl?: string;
  isCorrect: boolean;
}

export interface VerbImageTask {
  id: number;
  imageUrl?: string;
  word: { text: string; audioUrl?: string };
  actions: VerbActionOption[];
}

const imageModules = import.meta.glob("../assets/verb-to-image/images/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const audioModules = import.meta.glob("../assets/verb-to-image/audio/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(fileName: string): string | undefined {
  const key = Object.keys(imageModules).find((k) => k.endsWith(`/${fileName}`));
  return key ? imageModules[key] : undefined;
}

function resolveAudio(fileName: string): string | undefined {
  const key = Object.keys(audioModules).find((k) => k.endsWith(`/${fileName}`));
  return key ? audioModules[key] : undefined;
}

function buildTask(
  id: number,
  wordText: string,
  actions: Array<[text: string, correct: boolean]>,
): VerbImageTask {
  return {
    id,
    imageUrl: resolveImage(`${id}.png`),
    word: { text: wordText, audioUrl: resolveAudio(`word_${String(id).padStart(2, "0")}.mp3`) },
    actions: actions.map(([text, isCorrect], i) => ({
      text,
      isCorrect,
      audioUrl: resolveAudio(`action_${String(id).padStart(2, "0")}_${String(i + 1).padStart(2, "0")}.mp3`),
    })),
  };
}

export const verbImageTasks: VerbImageTask[] = [
  buildTask(1, "Молния", [["сверкает", true], ["пишет", false], ["горит", false]]),
  buildTask(2, "Часы", [["тикают", true], ["прыгают", false], ["гремят", false]]),
  buildTask(3, "Спортсмен", [["прыгает", true], ["решает", false], ["скачет", false]]),
  buildTask(4, "Дождь", [["льёт", true], ["красит", false], ["дует", false]]),
  buildTask(5, "Автобус", [["едет", true], ["скачет", false], ["плывёт", false]]),
  buildTask(6, "Волк", [["воет", true], ["рисует", false], ["лает", false]]),
  buildTask(7, "Собака", [["лает", true], ["готовит", false], ["мяукает", false]]),
  buildTask(8, "Бабочка", [["летает", true], ["ходит", false], ["поёт", false]]),
  buildTask(9, "Петух", [["кукарекает", true], ["читает", false], ["рычит", false]]),
  buildTask(10, "Рыба", [["плавает", true], ["едет", false], ["тонет", false]]),
  buildTask(11, "Солнце", [["светит", true], ["спит", false], ["моросит", false]]),
  buildTask(12, "Учитель", [["учит", true], ["стрижёт", false], ["воспитывает", false]]),
  buildTask(13, "Вода", [["течёт", true], ["прыгает", false], ["моет", false]]),
  buildTask(14, "Лягушка", [["квакает", true], ["работает", false], ["жужжит", false]]),
  buildTask(15, "Художник", [["рисует", true], ["шьёт", false], ["чертит", false]]),
];
