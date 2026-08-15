import { CommonWordTrainer } from "@/components/app/CommonWordTrainer";
import { commonNounExercises } from "@/data/commonNounTrainer";

export default function CommonNounTrainerPage() {
  return (
    <CommonWordTrainer
      title="КОД 06 — Выбрать общее слово (предмет)"
      description="Подберите общее слово (предмет) для трёх слов в колонке"
      exercises={commonNounExercises}
    />
  );
}
