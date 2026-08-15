import { CommonWordTrainer } from "@/components/app/CommonWordTrainer";
import { wordFeaturesExercises } from "@/data/wordFeaturesTrainer";

export default function WordFeaturesTrainerPage() {
  return (
    <CommonWordTrainer
      title="Распределить слова (признаки)"
      description="Подберите слова-признаки к существительным"
      exercises={wordFeaturesExercises}
    />
  );
}
