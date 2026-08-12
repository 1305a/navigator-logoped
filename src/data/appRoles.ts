import type { AppRole, RolePermission } from "./types";
import { permissionBlocks } from "./permissionBlocks";

function perms(granted: Record<string, { read?: boolean; edit?: boolean }>): RolePermission[] {
  return permissionBlocks.map((b) => ({
    blockId: b.id,
    read: granted[b.id]?.read ?? false,
    edit: granted[b.id]?.edit ?? false,
  }));
}

export const initialAppRoles: AppRole[] = [
  {
    id: "role-admin",
    title: "Администратор",
    interfaceKey: "admin",
    permissions: permissionBlocks.map((b) => ({ blockId: b.id, read: true, edit: true })),
  },
  {
    id: "role-nurse",
    title: "Медсестра",
    interfaceKey: "nurse",
    permissions: perms({
      "block-patients": { read: true, edit: true },
      "block-schedule": { read: true, edit: true },
      "block-staff": { read: true },
      "block-rooms": { read: true },
    }),
  },
  {
    id: "role-logoped",
    title: "Логопед",
    interfaceKey: "logoped",
    permissions: perms({
      "block-patients": { read: true, edit: true },
      "block-programs": { read: true, edit: true },
      "block-schedule": { read: true },
      "block-rooms": { read: true },
    }),
  },
  {
    id: "role-patient",
    title: "Пациент",
    interfaceKey: "patient",
    permissions: perms({}),
  },
];
