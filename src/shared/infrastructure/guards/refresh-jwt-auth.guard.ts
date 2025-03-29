// Password
import { AuthGuard } from '@nestjs/passport';
// NestJS
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh-jwt') {}
