import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookHeart, Plus } from "lucide-react";

const wellbeingOptions = ["Хорошее", "Нормальное", "Плохое"];
const moodOptions = ["Бодрое", "Хорошее", "Нормальное", "Грустное", "Подавленное"];
const weatherOptions = ["Ясно", "Пасмурно", "Переменная облачность", "Жара", "Снег", "Дождь"];

export default function DiaryPage() {
  const { diaryEntries, addDiaryEntry } = useAppState();
  const [creating, setCreating] = useState(false);
  const [wellbeing, setWellbeing] = useState(wellbeingOptions[0]);
  const [mood, setMood] = useState(moodOptions[0]);
  const [weather, setWeather] = useState(weatherOptions[0]);
  const [text, setText] = useState("");

  function handleSave() {
    addDiaryEntry({
      id: `d-${Date.now()}`,
      date: "27.07.2026",
      wellbeing,
      mood,
      weather,
      text: text.trim() || "Запись без комментария.",
    });
    toast.success("Запись сохранена в дневник");
    setText("");
    setCreating(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Мой дневник</h1>
          <p className="text-sm text-muted-foreground">
            Заметки о самочувствии и занятиях по дням
          </p>
        </div>
        {!creating && (
          <Button onClick={() => setCreating(true)} className="gap-1.5">
            <Plus className="size-4" /> Новая запись
          </Button>
        )}
      </div>

      {creating && (
        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle className="text-base">Новая запись · 27 июля 2026</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label>Какое сегодня самочувствие?</Label>
                <Select value={wellbeing} onValueChange={(v) => v && setWellbeing(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {wellbeingOptions.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Какое сегодня настроение?</Label>
                <Select value={mood} onValueChange={(v) => v && setMood(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {moodOptions.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Какая сегодня погода?</Label>
                <Select value={weather} onValueChange={(v) => v && setWeather(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weatherOptions.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Хочу записать в дневник</Label>
              <Textarea
                rows={9}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Опишите, как прошёл день, занятия, самочувствие…"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreating(false)}>
                Отмена
              </Button>
              <Button onClick={handleSave}>Сохранить</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {diaryEntries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookHeart className="size-4 text-primary" />
                  <CardTitle className="text-base">{entry.date}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-0.5">
                    Самочувствие: {entry.wellbeing}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5">
                    Настроение: {entry.mood}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5">Погода: {entry.weather}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground">{entry.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
