import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { demoUsers, roleLabels } from "@/data/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Stethoscope } from "lucide-react";

export default function LoginPage() {
  const { login } = useAppState();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(demoUsers[0].id);
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = demoUsers.find((u) => u.id === selectedUserId);
    if (!user) return;
    login(user.id);
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
                <div className="flex flex-col gap-2">
                  {demoUsers.map((user) => (
                    <button
                      type="button"
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                        selectedUserId === user.id
                          ? "border-primary bg-accent"
                          : "border-border hover:bg-muted/60",
                      )}
                    >
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {user.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {user.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({roleLabels[user.role]})
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
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
