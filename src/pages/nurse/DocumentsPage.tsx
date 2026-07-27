import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import { nurseDocuments } from "@/data/misc";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileText, Printer, UserPlus } from "lucide-react";

export default function DocumentsPage() {
  const { patients } = useAppState();
  const [openPatientId, setOpenPatientId] = useState<string | null>(null);
  const openPatient = patients.find((p) => p.id === openPatientId);

  function AddPatientButton() {
    return (
      <Button className="gap-1.5" render={<Link to="/nurse/add-patient" />}>
        <UserPlus className="size-4" /> Добавить пациента
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Документы</h1>
          <p className="text-sm text-muted-foreground">Документы пациентов учреждения</p>
        </div>
        <AddPatientButton />
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">№</TableHead>
              <TableHead>ФИО</TableHead>
              <TableHead>Дата рождения</TableHead>
              <TableHead>Тариф</TableHead>
              <TableHead>Лечащий врач</TableHead>
              <TableHead>Дата начала лечения</TableHead>
              <TableHead>Дата последнего приёма</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((p, idx) => (
              <TableRow key={p.id}>
                <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                <TableCell className="font-medium text-foreground">{p.fullName}</TableCell>
                <TableCell className="text-muted-foreground">{p.info.birthDate}</TableCell>
                <TableCell>
                  <Badge variant="outline">{p.tariff}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.info.attendingDoctor}</TableCell>
                <TableCell className="text-muted-foreground">{p.info.admissionDate}</TableCell>
                <TableCell className="text-muted-foreground">{p.lastActivity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" render={<Link to={`/nurse/patients/${p.id}`} />}>
                      Подробности
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpenPatientId(p.id)}>
                      <FileText className="size-3.5" /> Документы
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <AddPatientButton />
      </div>

      <Dialog open={!!openPatientId} onOpenChange={(open) => !open && setOpenPatientId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Документы пациента</DialogTitle>
            <DialogDescription>{openPatient?.fullName}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1">
            {nurseDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-muted/60">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.type} · {doc.date}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => toast.success(`Скачивание: ${doc.title}`)}
                  >
                    <Download className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => toast.success(`Отправлено на печать: ${doc.title}`)}
                  >
                    <Printer className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
