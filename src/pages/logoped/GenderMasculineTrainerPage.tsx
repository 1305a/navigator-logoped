import { GenderObjectTrainer } from "@/components/app/GenderObjectTrainer";
import { genderMasculineItems, genderMasculineTasks } from "@/data/genderMasculineTrainer";

export default function GenderMasculineTrainerPage() {
  return (
    <GenderObjectTrainer
      title="Выбор предмета МУЖ РОД"
      description="Нажмите «Послушайте» и выберите подходящую картинку"
      items={genderMasculineItems}
      tasks={genderMasculineTasks}
    />
  );
}
