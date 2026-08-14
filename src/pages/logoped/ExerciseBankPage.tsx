import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exerciseBank } from "@/data/exercises";
import { wordPartExercises } from "@/data/wordPartsTrainer";
import { letterFixTasks } from "@/data/letterFixTrainer";
import { Gamepad2, Play, Timer, Wrench } from "lucide-react";

export default function ExerciseBankPage() {
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
            {exerciseBank.map((ex) => (
              <Card key={ex.id}>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {ex.category}
                  </Badge>
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
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-12 text-center">
            <Wrench className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Раздел находится в разработке</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              Материалы для офлайн-занятий будут добавлены в следующей версии сервиса.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="trainers" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader>
                <Badge variant="secondary" className="w-fit">
                  Грамматика
                </Badge>
                <CardTitle className="text-base">
                  Добавить часть слова (начало/конец)
                </CardTitle>
                <CardDescription>
                  Словообразование: подставьте части слова до или после общей части —
                  {" "}
                  {wordPartExercises.length} заданий.
                </CardDescription>
                <CardAction>
                  <Gamepad2 className="size-4 text-muted-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Timer className="size-3.5" />5 мин
                </div>
                <Button
                  size="sm"
                  className="gap-1.5"
                  render={<Link to="trainer/word-parts" />}
                >
                  <Play className="size-3.5" /> Запустить
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="secondary" className="w-fit">
                  Звукопроизношение
                </Badge>
                <CardTitle className="text-base">Исправь букву в слове</CardTitle>
                <CardDescription>
                  Выберите правильную гласную букву в слове по картинке —{" "}
                  {letterFixTasks.length} заданий.
                </CardDescription>
                <CardAction>
                  <Gamepad2 className="size-4 text-muted-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Timer className="size-3.5" />5 мин
                </div>
                <Button
                  size="sm"
                  className="gap-1.5"
                  render={<Link to="trainer/letter-fix" />}
                >
                  <Play className="size-3.5" /> Запустить
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
