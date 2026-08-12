import { useState } from "react";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";
import { useAppState } from "@/context/AppStateContext";
import { roleLabels } from "@/data/users";
import type { Position, Role, StaffMember } from "@/data/types";
import { generateTimeOptions, timeToMinutes } from "@/lib/schedule";
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
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarClock, Pencil, UserPlus } from "lucide-react";

function formatRuDate(date: Date) {
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

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
  const { staff, addStaffMember, updateStaffMember, addStaffBooking, activityTypes, positions } =
    useAppState();

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
      bookings: [],
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

  const [scheduleStaffId, setScheduleStaffId] = useState<string | null>(null);
  const scheduleStaff = staff.find((s) => s.id === scheduleStaffId) ?? null;
  const [entryActivityType, setEntryActivityType] = useState("");
  const [entryMode, setEntryMode] = useState<"datetime" | "range">("datetime");
  const [entryDate, setEntryDate] = useState<Date | undefined>(undefined);
  const [entryStartTime, setEntryStartTime] = useState<string | null>(null);
  const [entryEndTime, setEntryEndTime] = useState<string | null>(null);
  const [entryRange, setEntryRange] = useState<DateRange | undefined>(undefined);
  const timeOptions = generateTimeOptions();

  function resetEntryForm() {
    setEntryActivityType("");
    setEntryMode("datetime");
    setEntryDate(undefined);
    setEntryStartTime(null);
    setEntryEndTime(null);
    setEntryRange(undefined);
  }

  function openSchedule(s: StaffMember) {
    setScheduleStaffId(s.id);
    resetEntryForm();
  }

  function handleAddEntry() {
    if (!scheduleStaff) return;
    if (!entryActivityType) {
      toast.error("Выберите тип занятости");
      return;
    }

    if (entryMode === "datetime") {
      if (!entryDate || !entryStartTime || !entryEndTime) {
        toast.error("Заполните дату и время");
        return;
      }
      if (timeToMinutes(entryEndTime) <= timeToMinutes(entryStartTime)) {
        toast.error("Время окончания должно быть позже времени начала");
        return;
      }
      const dateStr = formatRuDate(entryDate);
      addStaffBooking(scheduleStaff.id, {
        activityType: entryActivityType,
        dateFrom: dateStr,
        dateTo: dateStr,
        startTime: entryStartTime,
        endTime: entryEndTime,
        note: "",
      });
    } else {
      if (!entryRange?.from || !entryRange?.to) {
        toast.error("Заполните период дат");
        return;
      }
      if (entryRange.to < entryRange.from) {
        toast.error("Дата окончания периода раньше даты начала");
        return;
      }
      addStaffBooking(scheduleStaff.id, {
        activityType: entryActivityType,
        dateFrom: formatRuDate(entryRange.from),
        dateTo: formatRuDate(entryRange.to),
        startTime: null,
        endTime: null,
        note: "",
      });
    }

    toast.success("Запись добавлена в график");
    resetEntryForm();
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
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => openSchedule(s)}
                    >
                      <CalendarClock className="size-3.5" /> График
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => openEdit(s)}
                    >
                      <Pencil className="size-3.5" /> Изменить
                    </Button>
                  </div>
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

      <Dialog
        open={!!scheduleStaffId}
        onOpenChange={(open) => !open && setScheduleStaffId(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>График занятости — {scheduleStaff?.fullName}</DialogTitle>
            <DialogDescription>
              Записи о занятости сотрудника и ручное добавление новой записи
            </DialogDescription>
          </DialogHeader>

          {scheduleStaff && scheduleStaff.bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Тип</TableHead>
                  <TableHead>Даты</TableHead>
                  <TableHead>Время</TableHead>
                  <TableHead>Примечание</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...scheduleStaff.bookings]
                  .sort(
                    (a, b) =>
                      new Date(a.dateFrom.split(".").reverse().join("-")).getTime() -
                      new Date(b.dateFrom.split(".").reverse().join("-")).getTime(),
                  )
                  .map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>{b.activityType}</TableCell>
                      <TableCell>
                        {b.dateFrom === b.dateTo ? b.dateFrom : `${b.dateFrom} – ${b.dateTo}`}
                      </TableCell>
                      <TableCell>
                        {b.startTime && b.endTime ? `${b.startTime}–${b.endTime}` : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{b.note || "—"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">Нет записей</p>
          )}

          <Separator />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Тип занятости</Label>
              <Select
                value={entryActivityType}
                onValueChange={(v) => v && setEntryActivityType(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите тип занятости">
                    {(v: string | null) => v ?? "Выберите тип занятости"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((a) => (
                    <SelectItem key={a.id} value={a.title}>
                      {a.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <RadioGroup
              value={entryMode}
              onValueChange={(v) => v && setEntryMode(v as "datetime" | "range")}
            >
              <label className="flex items-center gap-2.5 text-sm text-foreground">
                <RadioGroupItem value="datetime" /> Дата и время
              </label>
              <label className="flex items-center gap-2.5 text-sm text-foreground">
                <RadioGroupItem value="range" /> Период дат
              </label>
            </RadioGroup>

            {entryMode === "datetime" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label>Дата</Label>
                  <Calendar
                    mode="single"
                    selected={entryDate}
                    onSelect={setEntryDate}
                    defaultMonth={entryDate}
                    className="self-center rounded-lg border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>Время с</Label>
                    <Select
                      value={entryStartTime ?? ""}
                      onValueChange={(v) => {
                        if (!v) return;
                        setEntryStartTime(v);
                        if (entryEndTime && timeToMinutes(entryEndTime) <= timeToMinutes(v)) {
                          setEntryEndTime(null);
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
                    <Select
                      value={entryEndTime ?? ""}
                      onValueChange={(v) => v && setEntryEndTime(v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions
                          .filter(
                            (t) =>
                              !entryStartTime || timeToMinutes(t) > timeToMinutes(entryStartTime),
                          )
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
            ) : (
              <div className="flex flex-col gap-1.5">
                <Label>Период дат</Label>
                <Calendar
                  mode="range"
                  selected={entryRange}
                  onSelect={setEntryRange}
                  defaultMonth={entryRange?.from}
                  className="self-center rounded-lg border"
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleAddEntry} className="gap-1.5">
                <CalendarClock className="size-4" /> Добавить запись
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
