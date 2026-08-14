export interface LetterFixWord {
  id: number;
  correctWord: string;
  incorrectWord: string;
  wrongIndex: number;
  correctLetter: string;
  imageUrl?: string;
}

export interface LetterFixTask {
  id: number;
  words: LetterFixWord[];
}

export const VOWELS = ["А", "О", "У", "Э", "Ы", "Я", "Ё", "Ю", "Е", "И"];

const imageModules = import.meta.glob("../assets/letter-fix/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(taskId: number, wordId: number): string | undefined {
  const suffix = `/${taskId}_${wordId}.png`;
  const key = Object.keys(imageModules).find((k) => k.endsWith(suffix));
  return key ? imageModules[key] : undefined;
}

function buildWord(
  taskId: number,
  id: number,
  incorrectWord: string,
  correctWord: string,
): LetterFixWord {
  const incorrect = incorrectWord.toUpperCase();
  const correct = correctWord.toUpperCase();
  let wrongIndex = 0;
  for (let i = 0; i < correct.length; i++) {
    if (incorrect[i] !== correct[i]) {
      wrongIndex = i;
      break;
    }
  }
  return {
    id,
    correctWord: correct,
    incorrectWord: incorrect,
    wrongIndex,
    correctLetter: correct[wrongIndex],
    imageUrl: resolveImage(taskId, id),
  };
}

function buildTask(id: number, wordDefs: Array<[incorrect: string, correct: string]>): LetterFixTask {
  return {
    id,
    words: wordDefs.map(([incorrect, correct], i) => buildWord(id, i + 1, incorrect, correct)),
  };
}

export const letterFixTasks: LetterFixTask[] = [
  buildTask(1, [
    ["моч", "мяч"],
    ["лык", "лук"],
    ["кет", "кот"],
    ["рик", "рак"],
  ]),
  buildTask(2, [
    ["дад", "дед"],
    ["жэк", "жук"],
    ["нуж", "нож"],
    ["рес", "рис"],
  ]),
  buildTask(3, [
    ["дим", "дым"],
    ["лог", "луг"],
    ["нус", "нос"],
    ["шэр", "шар"],
  ]),
  buildTask(4, [
    ["диш", "душ"],
    ["лек", "люк"],
    ["пяр", "пар"],
    ["руг", "рог"],
  ]),
  buildTask(5, [
    ["пэл", "пол"],
    ["кят", "кит"],
    ["муч", "меч"],
    ["чей", "чай"],
  ]),
  buildTask(6, [
    ["пих", "пух"],
    ["рет", "рот"],
    ["тоз", "таз"],
    ["луд", "лёд"],
  ]),
  buildTask(7, [
    ["сюд", "сад"],
    ["мод", "мёд"],
    ["хар", "хор"],
    ["лег", "луг"],
  ]),
  buildTask(8, [
    ["сим", "сом"],
    ["лек", "лак"],
    ["заб", "зуб"],
    ["пос", "пёс"],
  ]),
  buildTask(9, [
    ["вуник", "веник"],
    ["дотел", "дятел"],
    ["килос", "колос"],
    ["пелец", "палец"],
  ]),
  buildTask(10, [
    ["вотер", "ветер"],
    ["зумок", "замок"],
    ["певар", "повар"],
    ["фалин", "филин"],
  ]),
  buildTask(11, [
    ["вирон", "ворон"],
    ["кабик", "кубик"],
    ["пурец", "перец"],
    ["фокел", "факел"],
  ]),
  buildTask(12, [
    ["пурус", "парус"],
    ["ребот", "робот"],
    ["фяник", "финик"],
    ["табик", "тюбик"],
  ]),
  buildTask(13, [
    ["шушка", "шишка"],
    ["меска", "маска"],
    ["таква", "тыква"],
    ["кякла", "кукла"],
  ]),
  buildTask(14, [
    ["бунка", "банка"],
    ["волка", "вилка"],
    ["семка", "сумка"],
    ["ширты", "шорты"],
  ]),
  buildTask(15, [
    ["бючка", "бочка"],
    ["вунна", "ванна"],
    ["мыска", "миска"],
    ["рачка", "ручка"],
  ]),
];
