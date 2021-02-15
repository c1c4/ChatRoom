export interface UserInput {
  userName: string;
  password: string;
  email: string;
  urlAvatar?: string;
}

export interface UserOutput {
  id: number;
  userName: string;
  email: string;
  urlAvatar: string;
}
