import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppState } from "@/context/AppStateContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function AddPatientPage() {
  const { addPatient } = useAppState();
  const navigate = useNavigate();

  const [contactLastName, setContactLastName] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactMiddleName, setContactMiddleName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactNote, setContactNote] = useState("");

  const [patientLastName, setPatientLastName] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientMiddleName, setPatientMiddleName] = useState("");
  const [patientBirthDate, setPatientBirthDate] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientNote, setPatientNote] = useState("");

  function handleSave() {
    if (!patientLastName.trim() || !patientFirstName.trim()) {
      toast.error("Укажите фамилию и имя пациента");
      return;
    }
    const fullName = [patientLastName, patientFirstName, patientMiddleName]
      .filter(Boolean)
      .join(" ");
    const contactFullName = [contactLastName, contactFirstName, contactMiddleName]
      .filter(Boolean)
      .join(" ");

    addPatient({
      id: `p-${Date.now()}`,
      fullName,
      tariff: "Стандарт",
      notes: patientNote || "Новый пациент",
      lastActivity: "27.07.2026",
      avgRating: 0,
      info: {
        birthDate: patientBirthDate || "—",
        gender: "—",
        address: "—",
        phone: patientPhone || "—",
        contactPerson: contactFullName || "—",
        insurance: "ОМС",
        referral: "Добавлен вручную",
        admissionDate: "27.07.2026",
        attendingDoctor: "Иванова А.С.",
      },
      speechCard: null,
      programCreated: false,
      programSummary: "",
      assignedExercises: [],
    });
    toast.success("Пациент добавлен");
    navigate("/nurse/patients");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-1 gap-1.5"
          render={<Link to="/nurse/patients" />}
        >
          <ArrowLeft className="size-4" /> Пациенты
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Добавить пациента</h1>
        <p className="text-sm text-muted-foreground">Регистрация нового пациента в системе</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Контактное лицо</CardTitle>
          <CardDescription>Данные представителя пациента (родителя, опекуна и т.д.)</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Фамилия</Label>
              <Input value={contactLastName} onChange={(e) => setContactLastName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Имя</Label>
              <Input value={contactFirstName} onChange={(e) => setContactFirstName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Отчество</Label>
              <Input value={contactMiddleName} onChange={(e) => setContactMiddleName(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Телефон</Label>
            <Input
              placeholder="+7 (___) ___-__-__"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Дополнительная информация</Label>
            <Textarea rows={3} value={contactNote} onChange={(e) => setContactNote(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Пациент</CardTitle>
          <CardDescription>Личные данные пациента</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Фамилия</Label>
              <Input value={patientLastName} onChange={(e) => setPatientLastName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Имя</Label>
              <Input value={patientFirstName} onChange={(e) => setPatientFirstName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Отчество</Label>
              <Input value={patientMiddleName} onChange={(e) => setPatientMiddleName(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Дата рождения</Label>
              <Input
                placeholder="ДД-ММ-ГГГГ"
                value={patientBirthDate}
                onChange={(e) => setPatientBirthDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Телефон</Label>
              <Input
                placeholder="+7 (___) ___-__-__"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Дополнительная информация</Label>
            <Textarea rows={3} value={patientNote} onChange={(e) => setPatientNote(e.target.value)} />
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button onClick={handleSave} className="gap-1.5">
              <UserPlus className="size-4" /> Сохранить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
