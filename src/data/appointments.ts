import type { Appointment } from "./types";

const DOCTOR = "Иванова Анна Сергеевна";

const noRoom = { roomId: null, roomStartTime: null, roomEndTime: null };

export const appointments: Appointment[] = [
  { id: "a1", patientId: "p1", patientName: "Кузнецов Максим Игоревич", date: "27.07.2026", time: "10:00", type: "Индивидуальное занятие", doctorName: DOCTOR, ...noRoom },
  { id: "a2", patientId: "p4", patientName: "Соколова Вера Андреевна", date: "27.07.2026", time: "11:00", type: "Индивидуальное занятие", doctorName: DOCTOR, ...noRoom },
  { id: "a3", patientId: "p6", patientName: "Новикова Полина Алексеевна", date: "27.07.2026", time: "12:30", type: "Индивидуальное занятие", doctorName: DOCTOR, ...noRoom },
  { id: "a4", patientId: "p2", patientName: "Смирнова Елизавета Дмитриевна", date: "28.07.2026", time: "09:30", type: "Индивидуальное занятие", doctorName: DOCTOR, ...noRoom },
  { id: "a5", patientId: "p5", patientName: "Морозов Иван Сергеевич", date: "28.07.2026", time: "10:30", type: "Индивидуальное занятие", doctorName: DOCTOR, ...noRoom },
  { id: "a6", patientId: "p1", patientName: "Кузнецов Максим Игоревич", date: "28.07.2026", time: "14:00", type: "Контрольное занятие", doctorName: DOCTOR, ...noRoom },
  { id: "a7", patientId: "p3", patientName: "Волков Артём Павлович", date: "29.07.2026", time: "11:00", type: "Индивидуальное занятие", doctorName: DOCTOR, ...noRoom },
  { id: "a8", patientId: "p7", patientName: "Лебедев Артём Дмитриевич", date: "29.07.2026", time: "12:00", type: "Первичный приём", doctorName: DOCTOR, ...noRoom },
  { id: "a9", patientId: "p4", patientName: "Соколова Вера Андреевна", date: "30.07.2026", time: "09:00", type: "Индивидуальное занятие", doctorName: DOCTOR, ...noRoom },
  { id: "a10", patientId: "p6", patientName: "Новикова Полина Алексеевна", date: "30.07.2026", time: "10:00", type: "Индивидуальное занятие", doctorName: DOCTOR, ...noRoom },
  { id: "a11", patientId: "p1", patientName: "Кузнецов Максим Игоревич", date: "31.07.2026", time: "10:00", type: "Индивидуальное занятие", doctorName: DOCTOR, ...noRoom },
  { id: "a12", patientId: "p2", patientName: "Смирнова Елизавета Дмитриевна", date: "31.07.2026", time: "13:00", type: "Индивидуальное занятие", doctorName: DOCTOR, ...noRoom },
];
