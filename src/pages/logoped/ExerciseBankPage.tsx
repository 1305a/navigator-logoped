import { Link } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionAssignmentEditor } from "@/components/app/SectionAssignmentEditor";
import { Gamepad2, Package, Play, Timer } from "lucide-react";

export default function ExerciseBankPage() {
  const {
    exercises,
    trainerCatalog,
    offlineExercises,
    workSections,
    addExerciseSection,
    removeExerciseSection,
    addTrainerSection,
    removeTrainerSection,
    addOfflineExerciseSection,
    removeOfflineExerciseSection,
  } = useAppState();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Банк упражнений</h1>
        <p className="text-sm text-muted-foreground">
          Каталог тренажёров, доступных для назначения пациентам
        </p>
      </div>

      <Tabs defaultValue="online">
        <TabsList>
          <TabsTrigger value="online">Онлайн</TabsTrigger>
          <TabsTrigger value="offline">Оффлайн</TabsTrigger>
          <TabsTrigger value="trainers">Тренажёры</TabsTrigger>
        </TabsList>

        <TabsContent value="online" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {exercises.map((ex) => (
              <Card key={ex.id}>
                <CardHeader>
                  <SectionAssignmentEditor
                    sectionIds={ex.sectionIds}
                    allSections={workSections}
                    onAdd={(sectionId) => addExerciseSection(ex.id, sectionId)}
                    onRemove={(sectionId) => removeExerciseSection(ex.id, sectionId)}
                  />
                  <CardTitle className="text-base">{ex.title}</CardTitle>
                  <CardDescription>{ex.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Timer className="size-3.5" />
                    {ex.duration}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offline" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {offlineExercises.map((ex) => (
              <Card key={ex.id}>
                <CardHeader>
                  <SectionAssignmentEditor
                    sectionIds={ex.sectionIds}
                    allSections={workSections}
                    onAdd={(sectionId) => addOfflineExerciseSection(ex.id, sectionId)}
                    onRemove={(sectionId) => removeOfflineExerciseSection(ex.id, sectionId)}
                  />
                  <CardTitle className="text-base">{ex.title}</CardTitle>
                  <CardDescription>{ex.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Package className="size-3.5" />
                    {ex.format}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trainers" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trainerCatalog.map((trainer) => (
              <Card key={trainer.path}>
                <CardHeader>
                  <SectionAssignmentEditor
                    sectionIds={trainer.sectionIds}
                    allSections={workSections}
                    onAdd={(sectionId) => addTrainerSection(trainer.path, sectionId)}
                    onRemove={(sectionId) => removeTrainerSection(trainer.path, sectionId)}
                  />
                  <CardTitle className="text-base">{trainer.title}</CardTitle>
                  <CardDescription>
                    {trainer.description} — {trainer.count} заданий.
                  </CardDescription>
                  <CardAction>
                    <Gamepad2 className="size-4 text-muted-foreground" />
                  </CardAction>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Timer className="size-3.5" />
                    {trainer.duration}
                  </div>
                  <Button size="sm" className="gap-1.5" render={<Link to={trainer.path} />}>
                    <Play className="size-3.5" /> Запустить
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
