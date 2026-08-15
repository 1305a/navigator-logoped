import { CommonWordTrainer } from "@/components/app/CommonWordTrainer";
import { commonAdjectiveExercises } from "@/data/commonAdjectiveTrainer";

export default function CommonAdjectiveTrainerPage() {
  return (
    <CommonWordTrainer
      title="КОД 06 — Выбрать общее слово (признак)"
      description="Подберите общее слово (признак) для трёх слов в колонке"
      exercises={commonAdjectiveExercises}
    />
  );
}
