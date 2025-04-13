import { JwtTokenInterface } from '../../../factories/jwt-token/interfaces/jwt-token.interface';

export interface UserOutputDto {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  accessToken?: JwtTokenInterface | null;
  refreshToken?: JwtTokenInterface | null;
}
