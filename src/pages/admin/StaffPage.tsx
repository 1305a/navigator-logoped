import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import { roleLabels } from "@/data/users";
import type { Role } from "@/data/types";
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
import { UserPlus } from "lucide-react";

const staffRoles: Role[] = ["nurse", "logoped", "admin"];

export default function StaffPage() {
  const { staff, addStaffMember } = useAppState();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState<Role>("nurse");

  function handleAdd() {
    if (!fullName.trim() || !position.trim()) {
      toast.error("Заполните ФИО и должность");
      return;
    }
    addStaffMember({ id: `s-${Date.now()}`, fullName: fullName.trim(), position: position.trim(), role });
    toast.success("Сотрудник добавлен");
    setOpen(false);
    setFullName("");
    setPosition("");
    setRole("nurse");
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
                <Input value={position} onChange={(e) => setPosition(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Роль</Label>
                <Select value={role} onValueChange={(v) => v && setRole(v as Role)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {staffRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {roleLabels[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <TableHead>ФИО</TableHead>
              <TableHead>Должность</TableHead>
              <TableHead>Роль</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
