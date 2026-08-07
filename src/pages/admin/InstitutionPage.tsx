import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import { roleLabels } from "@/data/users";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const facilityTypeOptions = ["Поликлиника", "Стационар", "Реабилитационный центр", "Диспансер"];

const institutionTypeOptions = [
  "Логопедический центр",
  "Психоневрологический диспансер",
  "Многопрофильный медицинский центр",
  "Центр социальной реабилитации",
];

export default function InstitutionPage() {
  const { institution, updateInstitution, staff } = useAppState();
  const [name, setName] = useState(institution.name);
  const [address, setAddress] = useState(institution.address);
  const [shortName, setShortName] = useState(institution.shortName);
  const [headDoctorId, setHeadDoctorId] = useState(institution.headDoctorId);
  const [facilityType, setFacilityType] = useState(institution.facilityType);
  const [institutionType, setInstitutionType] = useState(institution.institutionType);
  const [bedFunction, setBedFunction] = useState(institution.bedFunction);
  const [sortOrder, setSortOrder] = useState(institution.sortOrder);

  function handleSave() {
    updateInstitution({
      name,
      address,
      shortName,
      headDoctorId,
      facilityType,
      institutionType,
      bedFunction,
      sortOrder,
    });
    toast.success("Изменения сохранены");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Учреждение</h1>
        <p className="text-sm text-muted-foreground">Основные параметры учреждения</p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Реквизиты учреждения</CardTitle>
          <CardDescription>Наименование, адрес и классификация учреждения</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Наименование</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Адрес</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Короткое наименование</Label>
            <Input value={shortName} onChange={(e) => setShortName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Главный врач</Label>
            <Select value={headDoctorId} onValueChange={(v) => v && setHeadDoctorId(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите сотрудника">
                  {(v: string | null) => {
                    const doctor = staff.find((s) => s.id === v);
                    return doctor
                      ? `${doctor.fullName} (${roleLabels[doctor.role].toUpperCase()})`
                      : "Выберите сотрудника";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {staff.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.fullName} ({roleLabels[s.role].toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Вид учреждения</Label>
            <Select value={facilityType} onValueChange={(v) => v && setFacilityType(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите вид учреждения" />
              </SelectTrigger>
              <SelectContent>
                {facilityTypeOptions.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Тип учреждения</Label>
            <Select value={institutionType} onValueChange={(v) => v && setInstitutionType(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите тип учреждения" />
              </SelectTrigger>
              <SelectContent>
                {institutionTypeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Функция койки</Label>
            <Input
              type="number"
              value={bedFunction}
              onChange={(e) => setBedFunction(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Порядок сортировки</Label>
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Сохранить</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
