import { useEffect, useState } from "react";
import type { Program2Session, Room } from "@/data/types";
import type { Program2ScheduleDetails } from "@/lib/program2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { generateTimeOptions, timeToMinutes } from "@/lib/schedule";
import { Plus, Save } from "lucide-react";

function formatRuDate(date: Date) {
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function parseRuDate(date: string): Date {
  const [d, m, y] = date.split(".").map(Number);
  return new Date(y, m - 1, d);
}

const timeOptions = generateTimeOptions();

export function Program2SessionModal({
  open,
  onOpenChange,
  rooms,
  session,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: Room[];
  session?: Program2Session | null;
  onSubmit: (details: Program2ScheduleDetails) => void;
}) {
  const [location, setLocation] = useState<"home" | "room">("home");
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLocation(session?.location ?? "home");
    setRoomId(session?.roomId ?? "");
    setDate(session?.date ? parseRuDate(session.date) : undefined);
    setStartTime(session?.startTime ?? null);
    setEndTime(session?.endTime ?? null);
  }, [open, session]);

  const valid =
    location === "home" ||
    (!!roomId &&
      !!date &&
      !!startTime &&
      !!endTime &&
      timeToMinutes(endTime) > timeToMinutes(startTime));

  function handleSubmit() {
    if (!valid) return;
    if (location === "home") {
      onSubmit({ location: "home", date: date ? formatRuDate(date) : null });
    } else {
      onSubmit({
        location: "room",
        roomId,
        date: formatRuDate(date as Date),
        startTime: startTime as string,
        endTime: endTime as string,
      });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{session ? "Изменить занятие" : "Добавить занятие"}</DialogTitle>
          <DialogDescription>Укажите место проведения занятия</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Место проведения</Label>
            <RadioGroup
              value={location}
              onValueChange={(v) => v && setLocation(v as "home" | "room")}
            >
              <label className="flex items-center gap-2.5 text-sm text-foreground">
                <RadioGroupItem value="home" /> Дома
              </label>
              <label className="flex items-center gap-2.5 text-sm text-foreground">
                <RadioGroupItem value="room" /> В кабинете
              </label>
            </RadioGroup>
          </div>

          {location === "home" && (
            <div className="flex flex-col gap-1.5">
              <Label>Дата (необязательно)</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={date}
                className="self-center rounded-lg border"
              />
            </div>
          )}

          {location === "room" && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label>Кабинет</Label>
                <Select value={roomId} onValueChange={(v) => v && setRoomId(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите кабинет">
                      {(v: string | null) =>
                        rooms.find((r) => r.id === v)?.name ?? "Выберите кабинет"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Дата</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  defaultMonth={date}
                  className="self-center rounded-lg border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Время с</Label>
                  <Select
                    value={startTime ?? ""}
                    onValueChange={(v) => {
                      if (!v) return;
                      setStartTime(v);
                      if (endTime && timeToMinutes(endTime) <= timeToMinutes(v)) {
                        setEndTime(null);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Время по</Label>
                  <Select value={endTime ?? ""} onValueChange={(v) => v && setEndTime(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions
                        .filter((t) => !startTime || timeToMinutes(t) > timeToMinutes(startTime))
                        .map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!valid} className="gap-1.5">
            {session ? (
              <>
                <Save className="size-4" /> Сохранить
              </>
            ) : (
              <>
                <Plus className="size-4" /> Добавить
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
