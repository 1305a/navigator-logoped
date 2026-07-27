import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import { fundingTypes } from "@/data/misc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function GeneralPage() {
  const { institution, updateInstitution } = useAppState();
  const [name, setName] = useState(institution.name);
  const [funding, setFunding] = useState<string[]>(institution.funding);

  function toggleFunding(id: string, checked: boolean) {
    setFunding((prev) => (checked ? [...prev, id] : prev.filter((f) => f !== id)));
  }

  function handleSave() {
    updateInstitution({ name, funding });
    toast.success("Изменения сохранены");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Общие настройки</h1>
        <p className="text-sm text-muted-foreground">Основные параметры учреждения</p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Учреждение</CardTitle>
          <CardDescription>Название и типы финансирования оказываемых услуг</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <Label>Название учреждения</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-3">
            <Label>Типы финансирования</Label>
            {fundingTypes.map((f) => (
              <label key={f.id} className="flex items-center gap-2.5 text-sm text-foreground">
                <Checkbox
                  checked={funding.includes(f.id)}
                  onCheckedChange={(checked) => toggleFunding(f.id, checked === true)}
                />
                {f.label}
              </label>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Сохранить</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
