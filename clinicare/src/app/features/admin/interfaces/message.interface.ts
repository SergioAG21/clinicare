export enum MessageStatus {
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
}

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: MessageStatus;
  answer?: string;
}
