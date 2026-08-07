import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { demoUsers, roleLabels } from "@/data/users";
import type { DemoUser, StaffMember } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stethoscope } from "lucide-react";

function staffToDemoUser(s: StaffMember): DemoUser {
  const [surname, firstName, patronymic] = s.fullName.split(" ");
  return {
    id: s.id,
    role: s.role,
    fullName: s.fullName,
    shortName: [firstName, patronymic].filter(Boolean).join(" "),
    avatarInitials: `${firstName?.[0] ?? ""}${surname?.[0] ?? ""}`,
  };
}

export default function LoginPage() {
  const { login, staff } = useAppState();
  const navigate = useNavigate();

  const staffUsers = staff.filter((s) => s.active).map(staffToDemoUser);
  const patientUsers = demoUsers.filter((u) => u.role === "patient");
  const loginableUsers = [...staffUsers, ...patientUsers];

  const [selectedUserId, setSelectedUserId] = useState(loginableUsers[0]?.id ?? "");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = loginableUsers.find((u) => u.id === selectedUserId);
    if (!user) return;
    login(user);
    navigate(`/${user.role}`);
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-gradient-to-b from-secondary/60 to-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Stethoscope className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Навигатор логопеда</h1>
          <p className="text-sm text-muted-foreground">
            Цифровая среда работы логопеда — вход в демонстрационный макет
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Вход в систему</CardTitle>
            <CardDescription>Выберите пользователя и введите любой пароль</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label>Пользователь</Label>
                <Select
                  value={selectedUserId}
                  onValueChange={(v) => v && setSelectedUserId(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите пользователя">
                      {(id: string | null) => {
                        const user = loginableUsers.find((u) => u.id === id);
                        return user
                          ? `${user.fullName} (${roleLabels[user.role]})`
                          : "Выберите пользователя";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Сотрудники</SelectLabel>
                      {staffUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.fullName} ({roleLabels[user.role]})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Пациент</SelectLabel>
                      {patientUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.fullName} ({roleLabels[user.role]})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Любое значение"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Демонстрационный макет. Данные не сохраняются между сессиями.
        </p>
      </div>
    </div>
  );
}
