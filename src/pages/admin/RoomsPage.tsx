import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import type { Room } from "@/data/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarClock, Pencil, Plus, Trash2 } from "lucide-react";

function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const da = new Date(a.date.split(".").reverse().join("-")).getTime();
    const db = new Date(b.date.split(".").reverse().join("-")).getTime();
    return da - db;
  });
}

export default function RoomsPage() {
  const { rooms, addRoom, updateRoom, removeRoom } = useAppState();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function handleAdd() {
    if (!name.trim()) {
      toast.error("Укажите название кабинета");
      return;
    }
    addRoom({ id: `room-${Date.now()}`, name: name.trim(), bookings: [] });
    toast.success("Кабинет добавлен");
    setOpen(false);
    setName("");
  }

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editName, setEditName] = useState("");

  function openEdit(r: Room) {
    setEditingRoom(r);
    setEditName(r.name);
  }

  function handleSaveEdit() {
    if (!editingRoom) return;
    if (!editName.trim()) {
      toast.error("Укажите название кабинета");
      return;
    }
    updateRoom(editingRoom.id, editName.trim());
    toast.success("Кабинет обновлён");
    setEditingRoom(null);
  }

  function handleRemove(r: Room) {
    removeRoom(r.id);
    toast.success("Кабинет удалён");
  }

  const [scheduleRoom, setScheduleRoom] = useState<Room | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Кабинеты</h1>
          <p className="text-sm text-muted-foreground">
            Список кабинетов и их график занятости
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-1.5" />}>
            <Plus className="size-4" /> Добавить кабинет
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить кабинет</DialogTitle>
              <DialogDescription>Укажите название нового кабинета</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Название</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd}>Добавить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Занятий в графике</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium text-foreground">{r.name}</TableCell>
                <TableCell className="text-muted-foreground">{r.bookings.length}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => setScheduleRoom(r)}
                    >
                      <CalendarClock className="size-3.5" /> График
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => openEdit(r)}
                    >
                      <Pencil className="size-3.5" /> Изменить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => handleRemove(r)}
                    >
                      <Trash2 className="size-3.5" /> Удалить
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingRoom} onOpenChange={(open) => !open && setEditingRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить кабинет</DialogTitle>
            <DialogDescription>Обновите название кабинета</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Название</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!scheduleRoom} onOpenChange={(open) => !open && setScheduleRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>График занятости — {scheduleRoom?.name}</DialogTitle>
            <DialogDescription>Занятые периоды времени по датам</DialogDescription>
          </DialogHeader>
          {scheduleRoom && scheduleRoom.bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Время</TableHead>
                  <TableHead>Врач</TableHead>
                  <TableHead>Пациент</TableHead>
                  <TableHead>Занятие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortByDate(scheduleRoom.bookings).map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.date}</TableCell>
                    <TableCell>
                      {b.startTime}–{b.endTime}
                    </TableCell>
                    <TableCell>{b.doctorName}</TableCell>
                    <TableCell>{b.patientName}</TableCell>
                    <TableCell>{b.sessionTitle}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">Нет занятых слотов</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
