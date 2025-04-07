export interface UserOutputDto {
  id: string;
  name: string;
  email: string;
  password: string;
  accessToken?: string | null;
  createdAt: Date;
}
