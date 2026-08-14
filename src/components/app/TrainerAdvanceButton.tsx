import { Button } from "@/components/ui/button";

export function TrainerAdvanceButton({
  isLast,
  onNext,
  onFinish,
}: {
  isLast: boolean;
  onNext: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="flex justify-center">
      <Button
        size="lg"
        className="rounded-full bg-emerald-600 px-8 text-white hover:bg-emerald-600/90"
        onClick={isLast ? onFinish : onNext}
      >
        {isLast ? "Завершить тренажёр" : "Дальше →"}
      </Button>
    </div>
  );
}
