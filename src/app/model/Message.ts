import { UserOutput } from './User';

export interface MessageInput {
  message: string;
  userId: number;
}

export interface MessageOutput {
  id: number;
  dateTime: string;
  message: string;
  user: UserOutput;
}
