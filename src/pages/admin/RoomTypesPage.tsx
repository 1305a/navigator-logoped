import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import type { RoomType } from "@/data/types";
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
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function RoomTypesPage() {
  const { roomTypes, addRoomType, updateRoomType, removeRoomType } = useAppState();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  function handleAdd() {
    if (!title.trim()) {
      toast.error("Укажите название типа кабинета");
      return;
    }
    addRoomType({ id: `rt-${Date.now()}`, title: title.trim() });
    toast.success("Тип кабинета добавлен");
    setOpen(false);
    setTitle("");
  }

  const [editingType, setEditingType] = useState<RoomType | null>(null);
  const [editTitle, setEditTitle] = useState("");

  function openEdit(t: RoomType) {
    setEditingType(t);
    setEditTitle(t.title);
  }

  function handleSaveEdit() {
    if (!editingType) return;
    if (!editTitle.trim()) {
      toast.error("Укажите название типа кабинета");
      return;
    }
    updateRoomType(editingType.id, editTitle.trim());
    toast.success("Тип кабинета обновлён");
    setEditingType(null);
  }

  function handleRemove(t: RoomType) {
    removeRoomType(t.id);
    toast.success("Тип кабинета удалён");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Типы кабинетов</h1>
          <p className="text-sm text-muted-foreground">
            Типы кабинетов, используемые в справочнике «Кабинеты»
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-1.5" />}>
            <Plus className="size-4" /> Добавить тип
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить тип кабинета</DialogTitle>
              <DialogDescription>Укажите название нового типа кабинета</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Название</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
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
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomTypes.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium text-foreground">{t.title}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => openEdit(t)}
                    >
                      <Pencil className="size-3.5" /> Изменить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => handleRemove(t)}
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

      <Dialog open={!!editingType} onOpenChange={(open) => !open && setEditingType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить тип кабинета</DialogTitle>
            <DialogDescription>Обновите название типа кабинета</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Название</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
