import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import type { Position } from "@/data/types";
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

export default function PositionsPage() {
  const { positions, addPosition, updatePosition, removePosition } = useAppState();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  function handleAdd() {
    if (!title.trim()) {
      toast.error("Укажите название должности");
      return;
    }
    addPosition({ id: `pos-${Date.now()}`, title: title.trim() });
    toast.success("Должность добавлена");
    setOpen(false);
    setTitle("");
  }

  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [editTitle, setEditTitle] = useState("");

  function openEdit(p: Position) {
    setEditingPosition(p);
    setEditTitle(p.title);
  }

  function handleSaveEdit() {
    if (!editingPosition) return;
    if (!editTitle.trim()) {
      toast.error("Укажите название должности");
      return;
    }
    updatePosition(editingPosition.id, editTitle.trim());
    toast.success("Должность обновлена");
    setEditingPosition(null);
  }

  function handleRemove(p: Position) {
    removePosition(p.id);
    toast.success("Должность удалена");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Должности</h1>
          <p className="text-sm text-muted-foreground">
            Список должностей сотрудников учреждения
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-1.5" />}>
            <Plus className="size-4" /> Добавить должность
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить должность</DialogTitle>
              <DialogDescription>Укажите название новой должности</DialogDescription>
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
            {positions.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => openEdit(p)}
                    >
                      <Pencil className="size-3.5" /> Изменить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => handleRemove(p)}
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

      <Dialog open={!!editingPosition} onOpenChange={(open) => !open && setEditingPosition(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить должность</DialogTitle>
            <DialogDescription>Обновите название должности</DialogDescription>
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
