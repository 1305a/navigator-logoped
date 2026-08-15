import { GenderObjectTrainer } from "@/components/app/GenderObjectTrainer";
import { genderFeminineItems, genderFeminineTasks } from "@/data/genderFeminineTrainer";

export default function GenderFeminineTrainerPage() {
  return (
    <GenderObjectTrainer
      title="Выбор предмета ЖЕН РОД"
      description="Нажмите «Послушайте» и выберите подходящую картинку"
      items={genderFeminineItems}
      tasks={genderFeminineTasks}
    />
  );
}
