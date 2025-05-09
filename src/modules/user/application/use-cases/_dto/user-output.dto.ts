import { JwtTokenInterface } from '@src/modules/auth/application/interfaces';

export interface UserOutputDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  accessToken?: JwtTokenInterface | null;
  refreshToken?: JwtTokenInterface | null;
}
