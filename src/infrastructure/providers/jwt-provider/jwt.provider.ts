import { Injectable } from '@nestjs/common';
import { JwtProviderInterface } from '@src/shared/application/providers/jwt-provider.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtProvider implements JwtProviderInterface {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }
}
