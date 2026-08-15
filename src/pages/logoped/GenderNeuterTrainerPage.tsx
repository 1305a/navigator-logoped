import { GenderObjectTrainer } from "@/components/app/GenderObjectTrainer";
import { genderNeuterItems, genderNeuterTasks } from "@/data/genderNeuterTrainer";

export default function GenderNeuterTrainerPage() {
  return (
    <GenderObjectTrainer
      title="Выбор предмета СР РОД"
      description="Нажмите «Послушайте» и выберите подходящую картинку"
      items={genderNeuterItems}
      tasks={genderNeuterTasks}
    />
  );
}
