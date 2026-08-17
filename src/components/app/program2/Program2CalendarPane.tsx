import { useMemo, useState } from "react";
import type { Exercise, Program2Session, Room, WorkSection } from "@/data/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";

function parseRuDate(date: string): Date {
  const [d, m, y] = date.split(".").map(Number);
  return new Date(y, m - 1, d);
}

function formatRuDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function Program2CalendarPane({
  sessions,
  rooms,
  exercises,
  workSections,
}: {
  sessions: Program2Session[];
  rooms: Room[];
  exercises: Exercise[];
  workSections: WorkSection[];
}) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  const scheduled = useMemo(
    () => sessions.filter((s): s is Program2Session & { date: string } => !!s.date),
    [sessions],
  );
  const sessionDates = useMemo(() => scheduled.map((s) => parseRuDate(s.date)), [scheduled]);

  const selectedRu = selected ? formatRuDate(selected) : null;
  const sessionsOnSelected = selectedRu ? scheduled.filter((s) => s.date === selectedRu) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Календарь</CardTitle>
        <CardDescription>Отмечены даты занятий из рабочей программы.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          defaultMonth={sessionDates[0] ?? selected}
          modifiers={{ hasSession: sessionDates }}
          modifiersClassNames={{ hasSession: "bg-accent text-accent-foreground font-semibold" }}
          disabled={(date) =>
            !sessionDates.some((d) => d.toDateString() === date.toDateString())
          }
          className="self-center rounded-lg border"
        />

        {!selectedRu && (
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="mt-0.5 size-3.5 shrink-0" />
            Выберите отмеченную дату, чтобы увидеть время и место занятия.
          </p>
        )}

        {selectedRu && sessionsOnSelected.length === 0 && (
          <p className="text-xs text-muted-foreground">На эту дату занятий нет.</p>
        )}

        {sessionsOnSelected.map((session) => {
          const room = rooms.find((r) => r.id === session.roomId);
          return (
            <div key={session.id} className="rounded-lg border bg-muted/20 p-2.5 text-sm">
              <p className="font-medium text-foreground">
                {session.startTime && session.endTime
                  ? `${session.startTime}–${session.endTime}`
                  : "Время не указано"}
              </p>
              <p className="text-xs text-muted-foreground">
                {session.location === "room" ? `Кабинет: ${room?.name ?? "—"}` : "Дома"}
              </p>

              {session.sections.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">В занятии пока нет разделов.</p>
              ) : (
                <div className="mt-2 flex flex-col gap-1.5">
                  {session.sections.map((section) => {
                    const sectionTitle =
                      workSections.find((s) => s.id === section.sectionId)?.title ?? "Раздел";
                    return (
                      <div key={section.id} className="rounded-md border bg-card p-1.5">
                        <p className="text-xs font-medium text-foreground">{sectionTitle}</p>
                        {section.exercises.length === 0 ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">Нет упражнений</p>
                        ) : (
                          <ul className="mt-1 flex flex-col gap-0.5 pl-3 text-xs text-muted-foreground">
                            {section.exercises.map((entry) => {
                              const exerciseTitle =
                                exercises.find((e) => e.id === entry.exerciseId)?.title ??
                                "Упражнение";
                              return (
                                <li key={entry.id} className="list-disc">
                                  {exerciseTitle}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
