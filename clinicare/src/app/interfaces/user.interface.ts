import { USER_ROLE } from '@lib/consts';
import { USER_STATUS } from '@lib/consts';

export type Role = typeof USER_ROLE;
export type Status = typeof USER_STATUS;

export type Usuario = {
  id: number;
  name: string;
  role: Role;
  email: string;
  created_at: string;
  password: string;
};

export interface RegisterData {
  dni: string;
  name: string;
  last_name: string;
  birth_date: string;
  phone_number: string;
  address: string;
  email: string;
  gender: string;
  password: string;
}

export interface ContactResponseData {
  id: number;
  message: string;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
  USER = 'USER',
}

enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
}

export interface User {
  id: number;
  dni: string;
  name: string;
  address: string;
  gender: Gender;
  roles: UserRole;
  email: string;
  last_name: string;
  birth_date: Date;
  phone_number: string;
  status: UserStatus;
  doctor_specialty?: string;
  profile_user_image?: string;
}
