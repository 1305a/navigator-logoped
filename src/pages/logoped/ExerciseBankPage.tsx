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
import { wordEndingBlocks } from "@/data/wordEndingsTrainer";
import { phraseBuilderPhrases } from "@/data/phraseBuilderTrainer";
import { phraseImageLevels } from "@/data/phraseImageMatchTrainer";
import { adjNounTasks } from "@/data/adjectiveNounTrainer";
import { verbImageTasks } from "@/data/verbToImageTrainer";
import { syllableInsertTasks } from "@/data/syllableInsertTrainer";
import { verbPrefixTasks } from "@/data/verbPrefixTrainer";
import { verbWordsExercises } from "@/data/verbWordsTrainer";
import { Gamepad2, Play, Timer, Wrench } from "lucide-react";

const trainerCatalog = [
  {
    path: "trainer/word-parts",
    category: "Грамматика",
    title: "Добавить часть слова (начало/конец)",
    description: "Словообразование: подставьте части слова до или после общей части",
    count: wordPartExercises.length,
    duration: "5 мин",
  },
  {
    path: "trainer/letter-fix",
    category: "Звукопроизношение",
    title: "Исправь букву в слове",
    description: "Выберите правильную гласную букву в слове по картинке",
    count: letterFixTasks.length,
    duration: "5 мин",
  },
  {
    path: "trainer/word-endings",
    category: "Словообразование",
    title: "Найти окончание слов",
    description: "Выберите правильные окончания слов и распределите их по трём веерам",
    count: wordEndingBlocks.length,
    duration: "4 мин",
  },
  {
    path: "trainer/phrase-builder",
    category: "Связная речь",
    title: "Составление фразы по картинке",
    description: "Составьте предложение из трёх слов (кто? что делает? что?) по изображению",
    count: phraseBuilderPhrases.length,
    duration: "3 мин",
  },
  {
    path: "trainer/phrase-image-match",
    category: "Связная речь",
    title: "Фраза и картинка",
    description: "Подберите подпись к картинке — соответствие фразы и изображения",
    count: phraseImageLevels.reduce((sum, l) => sum + l.tasks.length, 0),
    duration: "6 мин",
  },
  {
    path: "trainer/adjective-noun",
    category: "Грамматика",
    title: "Прилагательное и существительное",
    description: "Прослушайте словосочетание и выберите подходящую картинку",
    count: adjNounTasks.length,
    duration: "5 мин",
  },
  {
    path: "trainer/verb-to-image",
    category: "Грамматика",
    title: "Глагол к картинке",
    description: "Прослушайте слово и действие, ответьте «да» или «нет»",
    count: verbImageTasks.length,
    duration: "6 мин",
  },
  {
    path: "trainer/syllable-insert",
    category: "Слоговая структура",
    title: "Вставь слог в слово",
    description: "Выберите подходящий слог и вставьте его в пропуск в слове",
    count: syllableInsertTasks.length,
    duration: "6 мин",
  },
  {
    path: "trainer/verb-prefix",
    category: "Грамматика",
    title: "Глагол с приставками",
    description: "Добавьте приставку к глаголу в каждом предложении",
    count: verbPrefixTasks.length,
    duration: "5 мин",
  },
  {
    path: "trainer/verb-words",
    category: "Грамматика",
    title: "Слова-действия и есть глаголы",
    description: "Подберите слова-действия к глаголам",
    count: verbWordsExercises.length,
    duration: "5 мин",
  },
];

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
            {trainerCatalog.map((trainer) => (
              <Card key={trainer.path}>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {trainer.category}
                  </Badge>
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
