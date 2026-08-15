import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import type { WorkSection } from "@/data/types";
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

export default function WorkSectionsPage() {
  const { workSections, addWorkSection, updateWorkSection, removeWorkSection } = useAppState();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  function handleAdd() {
    if (!title.trim()) {
      toast.error("Укажите название раздела");
      return;
    }
    addWorkSection({ id: `ws-${Date.now()}`, title: title.trim() });
    toast.success("Раздел добавлен");
    setOpen(false);
    setTitle("");
  }

  const [editingSection, setEditingSection] = useState<WorkSection | null>(null);
  const [editTitle, setEditTitle] = useState("");

  function openEdit(s: WorkSection) {
    setEditingSection(s);
    setEditTitle(s.title);
  }

  function handleSaveEdit() {
    if (!editingSection) return;
    if (!editTitle.trim()) {
      toast.error("Укажите название раздела");
      return;
    }
    updateWorkSection(editingSection.id, editTitle.trim());
    toast.success("Раздел обновлён");
    setEditingSection(null);
  }

  function handleRemove(s: WorkSection) {
    removeWorkSection(s.id);
    toast.success("Раздел удалён");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Разделы логопедической работы</h1>
          <p className="text-sm text-muted-foreground">
            Классификация упражнений и тренажёров в банке упражнений
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-1.5" />}>
            <Plus className="size-4" /> Добавить раздел
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить раздел</DialogTitle>
              <DialogDescription>Укажите название нового раздела логопедической работы</DialogDescription>
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
            {workSections.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-foreground">{s.title}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openEdit(s)}>
                      <Pencil className="size-3.5" /> Изменить
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleRemove(s)}>
                      <Trash2 className="size-3.5" /> Удалить
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingSection} onOpenChange={(open) => !open && setEditingSection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить раздел</DialogTitle>
            <DialogDescription>Обновите название раздела</DialogDescription>
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
