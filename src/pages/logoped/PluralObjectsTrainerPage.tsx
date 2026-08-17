import { GenderObjectTrainer } from "@/components/app/GenderObjectTrainer";
import { pluralObjectsItems, pluralObjectsTasks } from "@/data/pluralObjectsTrainer";

export default function PluralObjectsTrainerPage() {
  return (
    <GenderObjectTrainer
      title="Выбор предмета МН ЧИСЛО"
      description="Нажмите «Послушайте» и выберите подходящую картинку"
      items={pluralObjectsItems}
      tasks={pluralObjectsTasks}
    />
  );
}
