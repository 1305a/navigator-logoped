import type { CommonWordExercise } from "./commonNounTrainer";
import { commonAdjectiveExercises } from "./commonAdjectiveTrainer";

const lc = (s: string) => s.toLowerCase();

export const wordFeaturesExercises: CommonWordExercise[] = commonAdjectiveExercises.map((ex) => ({
  ...ex,
  availableWords: ex.availableWords.map(lc),
  columns: ex.columns.map((col) => ({ answer: lc(col.answer), words: col.words.map(lc) })),
}));
