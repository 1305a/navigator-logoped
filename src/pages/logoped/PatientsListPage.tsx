import { Link } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { getSessionProgress } from "@/lib/therapy";
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
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

export default function PatientsListPage() {
  const { patients } = useAppState();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Мои пациенты</h1>
        <p className="text-sm text-muted-foreground">Список пациентов, закреплённых за вами</p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">Номер</TableHead>
              <TableHead>ФИО</TableHead>
              <TableHead>Тариф</TableHead>
              <TableHead>Заметки</TableHead>
              <TableHead>Дата последней активности</TableHead>
              <TableHead>Средняя оценка</TableHead>
              <TableHead className="w-40">Прогресс программы</TableHead>
              <TableHead className="text-right">Подробности по пациенту</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((p, idx) => {
              const { done, total, fraction } = getSessionProgress(p.sessions);
              return (
                <TableRow key={p.id}>
                  <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell className="font-medium text-foreground">{p.fullName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.tariff}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-muted-foreground">
                    {p.notes}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.lastActivity}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {p.avgRating.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {total === 0 ? (
                      <span className="text-xs text-muted-foreground">Программа не составлена</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <Progress value={fraction * 100} className="w-32" />
                        <span className="text-xs text-muted-foreground">
                          {done} / {total} занятий
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" render={<Link to={`/logoped/patients/${p.id}`} />}>
                      Подробности
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
