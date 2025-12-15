export enum AppointmentStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  specialityName: string;
  appointmentDate: Date;
  appointmentType: string;
  reason: string;
  status: AppointmentStatus;
  doctorNotes?: string;
  patientId?: number;
  document_url?: string;
}
