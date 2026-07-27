import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { exerciseBank } from "@/data/exercises";
import { Timer, Wrench } from "lucide-react";

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
      </Tabs>
    </div>
  );
}
