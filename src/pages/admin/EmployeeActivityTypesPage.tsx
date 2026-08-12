import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import type { EmployeeActivityType } from "@/data/types";
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

export default function EmployeeActivityTypesPage() {
  const { activityTypes, addActivityType, updateActivityType, removeActivityType } =
    useAppState();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  function handleAdd() {
    if (!title.trim()) {
      toast.error("Укажите название типа занятости");
      return;
    }
    addActivityType({ id: `act-${Date.now()}`, title: title.trim() });
    toast.success("Тип занятости добавлен");
    setOpen(false);
    setTitle("");
  }

  const [editingType, setEditingType] = useState<EmployeeActivityType | null>(null);
  const [editTitle, setEditTitle] = useState("");

  function openEdit(a: EmployeeActivityType) {
    setEditingType(a);
    setEditTitle(a.title);
  }

  function handleSaveEdit() {
    if (!editingType) return;
    if (!editTitle.trim()) {
      toast.error("Укажите название типа занятости");
      return;
    }
    updateActivityType(editingType.id, editTitle.trim());
    toast.success("Тип занятости обновлён");
    setEditingType(null);
  }

  function handleRemove(a: EmployeeActivityType) {
    removeActivityType(a.id);
    toast.success("Тип занятости удалён");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Тип занятости сотрудника</h1>
          <p className="text-sm text-muted-foreground">
            Типы занятости, используемые в графике сотрудников
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-1.5" />}>
            <Plus className="size-4" /> Добавить тип
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить тип занятости</DialogTitle>
              <DialogDescription>Укажите название нового типа занятости</DialogDescription>
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
            {activityTypes.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium text-foreground">{a.title}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => openEdit(a)}
                    >
                      <Pencil className="size-3.5" /> Изменить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => handleRemove(a)}
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
            <DialogTitle>Изменить тип занятости</DialogTitle>
            <DialogDescription>Обновите название типа занятости</DialogDescription>
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
