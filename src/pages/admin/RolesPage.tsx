import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import type { AppRole, Role, RolePermission } from "@/data/types";
import { permissionBlocks } from "@/data/permissionBlocks";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Plus, Trash2 } from "lucide-react";

const interfaceOptions: Role[] = ["admin", "nurse", "logoped", "patient"];

const interfaceLabels: Record<Role, string> = {
  admin: "Интерфейс администратора",
  nurse: "Интерфейс медсестры",
  logoped: "Интерфейс логопеда",
  patient: "Интерфейс пациента",
};

function InterfaceSelect({
  value,
  onChange,
}: {
  value: Role | "";
  onChange: (v: Role) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v as Role)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Выберите интерфейс">
          {(v: string | null) => (v ? interfaceLabels[v as Role] : "Выберите интерфейс")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {interfaceOptions.map((r) => (
          <SelectItem key={r} value={r}>
            {interfaceLabels[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function emptyPermissions(): RolePermission[] {
  return permissionBlocks.map((b) => ({ blockId: b.id, read: false, edit: false }));
}

export default function RolesPage() {
  const { appRoles, addAppRole, updateAppRole, removeAppRole } = useAppState();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  function handleAdd() {
    if (!title.trim()) {
      toast.error("Укажите наименование роли");
      return;
    }
    addAppRole({
      id: `role-${Date.now()}`,
      title: title.trim(),
      interfaceKey: "",
      permissions: emptyPermissions(),
    });
    toast.success("Роль добавлена");
    setOpen(false);
    setTitle("");
  }

  function handleRemove(r: AppRole) {
    removeAppRole(r.id);
    toast.success("Роль удалена");
  }

  const [editingRole, setEditingRole] = useState<AppRole | null>(null);
  const [editTab, setEditTab] = useState("interface");
  const [editTitle, setEditTitle] = useState("");
  const [editInterfaceKey, setEditInterfaceKey] = useState<Role | "">("");
  const [editPermissions, setEditPermissions] = useState<RolePermission[]>([]);

  function openEdit(r: AppRole) {
    setEditingRole(r);
    setEditTab("interface");
    setEditTitle(r.title);
    setEditInterfaceKey(r.interfaceKey);
    setEditPermissions(r.permissions);
  }

  function togglePermission(blockId: string, field: "read" | "edit", checked: boolean) {
    setEditPermissions((prev) =>
      prev.map((p) => (p.blockId === blockId ? { ...p, [field]: checked } : p)),
    );
  }

  function handleSaveEdit() {
    if (!editingRole) return;
    if (!editTitle.trim()) {
      toast.error("Укажите наименование роли");
      return;
    }
    updateAppRole(editingRole.id, {
      title: editTitle.trim(),
      interfaceKey: editInterfaceKey,
      permissions: editPermissions,
    });
    toast.success("Роль обновлена");
    setEditingRole(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Роли</h1>
          <p className="text-sm text-muted-foreground">
            Роли пользователей, их интерфейс и права доступа
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-1.5" />}>
            <Plus className="size-4" /> Добавить роль
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить роль</DialogTitle>
              <DialogDescription>Укажите наименование новой роли</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Наименование</Label>
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
              <TableHead>Наименование</TableHead>
              <TableHead>Интерфейс</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appRoles.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium text-foreground">{r.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {r.interfaceKey ? interfaceLabels[r.interfaceKey] : "Не назначен"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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

      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Изменить роль</DialogTitle>
            <DialogDescription>Наименование, интерфейс и права доступа роли</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label>Наименование</Label>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          </div>

          <Tabs value={editTab} onValueChange={setEditTab} className="min-w-0">
            <TabsList>
              <TabsTrigger value="interface">Интерфейс</TabsTrigger>
              <TabsTrigger value="permissions">Права</TabsTrigger>
            </TabsList>

            <TabsContent value="interface" className="mt-4">
              <div className="flex flex-col gap-1.5">
                <Label>Интерфейс</Label>
                <InterfaceSelect value={editInterfaceKey} onChange={setEditInterfaceKey} />
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="mt-4 min-w-0">
              <div className="min-w-0 rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-normal">Наименование</TableHead>
                      <TableHead className="w-24 whitespace-normal">Чтение</TableHead>
                      <TableHead className="w-28 whitespace-normal">Редактирование</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionBlocks.map((block) => {
                      const perm = editPermissions.find((p) => p.blockId === block.id);
                      return (
                        <TableRow key={block.id}>
                          <TableCell className="whitespace-normal">{block.title}</TableCell>
                          <TableCell>
                            <Checkbox
                              checked={perm?.read ?? false}
                              onCheckedChange={(checked) =>
                                togglePermission(block.id, "read", checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={perm?.edit ?? false}
                              onCheckedChange={(checked) =>
                                togglePermission(block.id, "edit", checked === true)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={handleSaveEdit}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
