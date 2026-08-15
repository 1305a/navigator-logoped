import type { TrainerCatalogEntry } from "./types";
import { wordPartExercises } from "./wordPartsTrainer";
import { letterFixTasks } from "./letterFixTrainer";
import { wordEndingBlocks } from "./wordEndingsTrainer";
import { phraseBuilderPhrases } from "./phraseBuilderTrainer";
import { phraseImageLevels } from "./phraseImageMatchTrainer";
import { adjNounTasks } from "./adjectiveNounTrainer";
import { verbImageTasks } from "./verbToImageTrainer";
import { syllableInsertTasks } from "./syllableInsertTrainer";
import { verbPrefixTasks } from "./verbPrefixTrainer";
import { verbWordsExercises } from "./verbWordsTrainer";
import { wordFeaturesExercises } from "./wordFeaturesTrainer";
import { verbPhraseExercises } from "./verbPhrasesTrainer";
import { anagramTasks } from "./anagramsTrainer";
import { phraseAssemblyTasks } from "./phraseAssemblyTrainer";
import { commonNounExercises } from "./commonNounTrainer";
import { commonAdjectiveExercises } from "./commonAdjectiveTrainer";
import { paronymTasks } from "./paronymsTrainer";
import { composePhraseTasks } from "./composePhraseTrainer";
import { missingLettersTasks } from "./missingLettersTrainer";
import { prepositionLevels } from "./prepositionsTrainer";
import { letterSearchTasks } from "./letterSearchTrainer";
import { showWhereSets } from "./showWhereTrainer";
import { showSceneRows } from "./showSceneTrainer";
import { wordToPictureLevels } from "./wordToPictureTrainer";
import { verbPictureLevels } from "./verbToPictureTrainer";
import { featurePairTasks } from "./chooseByFeatureTrainer";
import { pictureWordTasks } from "./pictureAndWordTrainer";
import { genderMasculineTasks } from "./genderMasculineTrainer";
import { genderFeminineTasks } from "./genderFeminineTrainer";
import { genderNeuterTasks } from "./genderNeuterTrainer";

export const initialTrainerCatalog: TrainerCatalogEntry[] = [
  {
    path: "trainer/word-parts",
    sectionIds: ["ws6"],
    title: "Добавить часть слова (начало/конец)",
    description: "Словообразование: подставьте части слова до или после общей части",
    count: wordPartExercises.length,
    duration: "5 мин",
  },
  {
    path: "trainer/letter-fix",
    sectionIds: ["ws3"],
    title: "Исправь букву в слове",
    description: "Выберите правильную гласную букву в слове по картинке",
    count: letterFixTasks.length,
    duration: "5 мин",
  },
  {
    path: "trainer/word-endings",
    sectionIds: ["ws8"],
    title: "Найти окончание слов",
    description: "Выберите правильные окончания слов и распределите их по трём веерам",
    count: wordEndingBlocks.length,
    duration: "4 мин",
  },
  {
    path: "trainer/phrase-builder",
    sectionIds: ["ws7"],
    title: "Составление фразы по картинке",
    description: "Составьте предложение из трёх слов (кто? что делает? что?) по изображению",
    count: phraseBuilderPhrases.length,
    duration: "3 мин",
  },
  {
    path: "trainer/phrase-image-match",
    sectionIds: ["ws7"],
    title: "Фраза и картинка",
    description: "Подберите подпись к картинке — соответствие фразы и изображения",
    count: phraseImageLevels.reduce((sum, l) => sum + l.tasks.length, 0),
    duration: "6 мин",
  },
  {
    path: "trainer/adjective-noun",
    sectionIds: ["ws6"],
    title: "Прилагательное и существительное",
    description: "Прослушайте словосочетание и выберите подходящую картинку",
    count: adjNounTasks.length,
    duration: "5 мин",
  },
  {
    path: "trainer/verb-to-image",
    sectionIds: ["ws6"],
    title: "Глагол к картинке",
    description: "Прослушайте слово и действие, ответьте «да» или «нет»",
    count: verbImageTasks.length,
    duration: "6 мин",
  },
  {
    path: "trainer/syllable-insert",
    sectionIds: ["ws9"],
    title: "Вставь слог в слово",
    description: "Выберите подходящий слог и вставьте его в пропуск в слове",
    count: syllableInsertTasks.length,
    duration: "6 мин",
  },
  {
    path: "trainer/verb-prefix",
    sectionIds: ["ws6"],
    title: "Глагол с приставками",
    description: "Добавьте приставку к глаголу в каждом предложении",
    count: verbPrefixTasks.length,
    duration: "5 мин",
  },
  {
    path: "trainer/verb-words",
    sectionIds: ["ws6"],
    title: "Слова-действия и есть глаголы",
    description: "Подберите слова-действия к глаголам",
    count: verbWordsExercises.length,
    duration: "5 мин",
  },
  {
    path: "trainer/word-features",
    sectionIds: ["ws8"],
    title: "Распределить слова (признаки)",
    description: "Подберите слова-признаки к существительным",
    count: wordFeaturesExercises.length,
    duration: "5 мин",
  },
  {
    path: "trainer/verb-phrases",
    sectionIds: ["ws10"],
    title: "КОД 07 — Составить словосочетания (действия)",
    description: "Подберите слова к глаголам (2 слова на каждый глагол)",
    count: verbPhraseExercises.length,
    duration: "5 мин",
  },
  {
    path: "trainer/anagrams",
    sectionIds: ["ws11"],
    title: "КОД 09 — Анаграммы",
    description: "Переставьте буквы в слове, чтобы получилось другое слово",
    count: Object.values(anagramTasks).reduce((sum, words) => sum + words.length, 0),
    duration: "6 мин",
  },
  {
    path: "trainer/phrase-assembly",
    sectionIds: ["ws7"],
    title: "Составьте фразы",
    description: "Составьте предложение из слов по подсказкам",
    count: phraseAssemblyTasks.reduce((sum, t) => sum + t.phrases.length, 0),
    duration: "6 мин",
  },
  {
    path: "trainer/common-noun",
    sectionIds: ["ws8"],
    title: "КОД 06 — Выбрать общее слово (предмет)",
    description: "Подберите общее слово (предмет) для трёх слов в колонке",
    count: commonNounExercises.length,
    duration: "5 мин",
  },
  {
    path: "trainer/common-adjective",
    sectionIds: ["ws8"],
    title: "КОД 06 — Выбрать общее слово (признак)",
    description: "Подберите общее слово (признак) для трёх слов в колонке",
    count: commonAdjectiveExercises.length,
    duration: "5 мин",
  },
  {
    path: "trainer/paronyms",
    sectionIds: ["ws10"],
    title: "Паронимы в словосочетаниях",
    description: "Подберите подходящее по смыслу слово к прилагательному",
    count: paronymTasks.reduce((sum, t) => sum + t.phrases.length, 0),
    duration: "6 мин",
  },
  {
    path: "trainer/compose-phrase",
    sectionIds: ["ws7"],
    title: "Составь фразу",
    description: "Составьте фразу по картинке: «Кто? — Что делает? — Что?/Кого?»",
    count: composePhraseTasks.reduce((sum, t) => sum + t.phrases.length, 0),
    duration: "6 мин",
  },
  {
    path: "trainer/missing-letters",
    sectionIds: ["ws12"],
    title: "Вставьте пропущенные буквы",
    description: "Выберите гласную и вставьте её в пропуск в тексте",
    count: missingLettersTasks.length,
    duration: "6 мин",
  },
  {
    path: "trainer/prepositions",
    sectionIds: ["ws6"],
    title: "Вставьте предлоги",
    description: "Выберите предлог и вставьте его в пропуск в словосочетании",
    count: prepositionLevels.reduce((sum, l) => sum + l.tasks.length, 0),
    duration: "6 мин",
  },
  {
    path: "trainer/letter-search",
    sectionIds: ["ws12"],
    title: "Найдите слова на букву М среди букв",
    description: "Выберите буквы слова и нажмите «Готово»",
    count: letterSearchTasks.reduce((sum, t) => sum + t.rows.length, 0),
    duration: "6 мин",
  },
  {
    path: "trainer/show-where",
    sectionIds: ["ws13"],
    title: "Покажите, где…",
    description: "Прослушайте слово и выберите соответствующую картинку",
    count: showWhereSets.length,
    duration: "5 мин",
  },
  {
    path: "trainer/show-scene",
    sectionIds: ["ws7"],
    title: "Покажите…",
    description: "Прослушайте фразу и выберите соответствующую сцену из двух карточек",
    count: showSceneRows.length,
    duration: "8 мин",
  },
  {
    path: "trainer/word-to-picture",
    sectionIds: ["ws13"],
    title: "Подбери слово к картинке",
    description: "Выберите подходящее слово для каждой картинки",
    count: wordToPictureLevels.reduce((sum, l) => sum + l.tasks.length, 0),
    duration: "6 мин",
  },
  {
    path: "trainer/verb-to-picture",
    sectionIds: ["ws6"],
    title: "Подбери глагол",
    description: "Вставьте подходящий глагол в предложение по картинке",
    count: verbPictureLevels.reduce((sum, l) => sum + l.tasks.length, 0),
    duration: "8 мин",
  },
  {
    path: "trainer/choose-by-feature",
    sectionIds: ["ws13"],
    title: "Выбери предмет по признаку",
    description: "Прослушайте вопрос и выберите предмет по его характеристике",
    count: featurePairTasks.length,
    duration: "8 мин",
  },
  {
    path: "trainer/picture-and-word",
    sectionIds: ["ws13"],
    title: "Картинка и слово",
    description: "Слушайте слово и отвечайте «да» или «нет», соответствует ли оно картинке",
    count: pictureWordTasks.length,
    duration: "8 мин",
  },
  {
    path: "trainer/gender-masculine",
    sectionIds: ["ws6"],
    title: "Выбор предмета МУЖ РОД",
    description: "Нажмите «Послушайте» и выберите подходящую картинку",
    count: genderMasculineTasks.length,
    duration: "5 мин",
  },
  {
    path: "trainer/gender-feminine",
    sectionIds: ["ws6"],
    title: "Выбор предмета ЖЕН РОД",
    description: "Нажмите «Послушайте» и выберите подходящую картинку",
    count: genderFeminineTasks.length,
    duration: "5 мин",
  },
  {
    path: "trainer/gender-neuter",
    sectionIds: ["ws6"],
    title: "Выбор предмета СР РОД",
    description: "Нажмите «Послушайте» и выберите подходящую картинку",
    count: genderNeuterTasks.length,
    duration: "5 мин",
  },
];
