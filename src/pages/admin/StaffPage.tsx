import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import { roleLabels } from "@/data/users";
import type { Position, Role, StaffMember } from "@/data/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Pencil, UserPlus } from "lucide-react";

const staffRoles: Role[] = ["nurse", "logoped", "admin"];

function RoleSelect({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v as Role)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Выберите роль">
          {(v: Role | null) => (v ? roleLabels[v] : "Выберите роль")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {staffRoles.map((r) => (
          <SelectItem key={r} value={r}>
            {roleLabels[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function PositionSelect({
  value,
  onChange,
  positions,
}: {
  value: string;
  onChange: (title: string) => void;
  positions: Position[];
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Выберите должность">
          {(v: string | null) => v ?? "Выберите должность"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {positions.map((p) => (
          <SelectItem key={p.id} value={p.title}>
            {p.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function StaffPage() {
  const { staff, addStaffMember, updateStaffMember, positions } = useAppState();

  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState<Role>("nurse");
  const [active, setActive] = useState(true);

  function handleAdd() {
    if (!fullName.trim() || !position) {
      toast.error("Заполните ФИО и должность");
      return;
    }
    addStaffMember({
      id: `s-${Date.now()}`,
      fullName: fullName.trim(),
      position,
      role,
      active,
    });
    toast.success("Сотрудник добавлен");
    setOpen(false);
    setFullName("");
    setPosition("");
    setRole("nurse");
    setActive(true);
  }

  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editRole, setEditRole] = useState<Role>("nurse");
  const [editActive, setEditActive] = useState(true);

  function openEdit(s: StaffMember) {
    setEditingStaff(s);
    setEditFullName(s.fullName);
    setEditPosition(s.position);
    setEditRole(s.role);
    setEditActive(s.active);
  }

  function handleSaveEdit() {
    if (!editingStaff) return;
    if (!editFullName.trim() || !editPosition) {
      toast.error("Заполните ФИО и должность");
      return;
    }
    updateStaffMember(editingStaff.id, {
      fullName: editFullName.trim(),
      position: editPosition,
      role: editRole,
      active: editActive,
    });
    toast.success("Данные сотрудника обновлены");
    setEditingStaff(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Список сотрудников</h1>
          <p className="text-sm text-muted-foreground">Сотрудники учреждения и их роли</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-1.5" />}>
            <UserPlus className="size-4" /> Добавить сотрудника
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить сотрудника</DialogTitle>
              <DialogDescription>Укажите ФИО, должность и роль в системе</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>ФИО</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Должность</Label>
                <PositionSelect value={position} onChange={setPosition} positions={positions} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Роль</Label>
                <RoleSelect value={role} onChange={setRole} />
              </div>
              <label className="flex items-center gap-2.5 text-sm text-foreground">
                <Checkbox
                  checked={active}
                  onCheckedChange={(checked) => setActive(checked === true)}
                />
                Активный
              </label>
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
              <TableHead>ФИО</TableHead>
              <TableHead>Должность</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-foreground">{s.fullName}</TableCell>
                <TableCell className="text-muted-foreground">{s.position}</TableCell>
                <TableCell>
                  <Badge variant="outline">{roleLabels[s.role]}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={s.active ? "secondary" : "outline"}>
                    {s.active ? "Активен" : "Неактивен"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => openEdit(s)}
                  >
                    <Pencil className="size-3.5" /> Изменить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить сотрудника</DialogTitle>
            <DialogDescription>Обновите ФИО, должность и роль в системе</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>ФИО</Label>
              <Input value={editFullName} onChange={(e) => setEditFullName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Должность</Label>
              <PositionSelect value={editPosition} onChange={setEditPosition} positions={positions} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Роль</Label>
              <RoleSelect value={editRole} onChange={setEditRole} />
            </div>
            <label className="flex items-center gap-2.5 text-sm text-foreground">
              <Checkbox
                checked={editActive}
                onCheckedChange={(checked) => setEditActive(checked === true)}
              />
              Активный
            </label>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
