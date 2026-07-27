import { useAppState } from "@/context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("");
}

export default function SchedulePage() {
  const { appointments } = useAppState();

  const byDate = appointments.reduce<Record<string, typeof appointments>>((acc, a) => {
    (acc[a.date] ??= []).push(a);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort(
    (a, b) =>
      new Date(a.split(".").reverse().join("-")).getTime() -
      new Date(b.split(".").reverse().join("-")).getTime(),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">График приёма</h1>
        <p className="text-sm text-muted-foreground">Расписание приёма пациентов логопедом</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dates.map((date) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle className="text-base">{date}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {byDate[date]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/60"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                        {initials(a.patientName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {a.patientName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{a.type}</p>
                    </div>
                    <Badge variant="secondary">{a.time}</Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
