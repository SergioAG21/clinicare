import { UserRole } from './../interfaces/user.interface';

export const APP_NAME = 'CliniCare';
export const USER_ROLE = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
  USER: 'USER',
};

export const USER_STATUS = {
  PENDING: 'PENDING',
  INCOMPLETE: 'INCOMPLETE',
  ACTIVE: 'ACTIVE',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

export const ROLE_MAP: Record<string, number> = {
  ADMIN: 1,
  DOCTOR: 2,
  PATIENT: 3,
};

export const USER_ROLE_MAP: Record<UserRole, number> = {
  ADMIN: 0,
  DOCTOR: 1,
  PATIENT: 2,
  USER: 3,
};
