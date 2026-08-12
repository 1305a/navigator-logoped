export interface PermissionBlock {
  id: string;
  title: string;
}

export const permissionBlocks: PermissionBlock[] = [
  { id: "block-patients", title: "Справочник «Пациенты»" },
  { id: "block-staff", title: "Справочник «Сотрудники»" },
  { id: "block-rooms", title: "Справочник «Кабинеты»" },
  { id: "block-positions", title: "Справочник «Должности»" },
  { id: "block-activity-types", title: "Справочник «Тип занятости сотрудника»" },
  { id: "block-programs", title: "Программы пациентов" },
  { id: "block-schedule", title: "Расписание и запись на приём" },
  { id: "block-institution", title: "Настройки учреждения" },
];
