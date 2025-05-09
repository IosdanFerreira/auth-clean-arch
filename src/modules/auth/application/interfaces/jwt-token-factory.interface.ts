import { JwtTokenInterface } from './jwt-token.interface';

export interface JwtTokenFactoryInterface {
  generateAccessToken(
    userId: string,
    email: string,
  ): Promise<JwtTokenInterface>;

  generateRefreshToken(
    userId: string,
    email: string,
  ): Promise<JwtTokenInterface>;

  verifyToken(token: string): Promise<any>;
}
