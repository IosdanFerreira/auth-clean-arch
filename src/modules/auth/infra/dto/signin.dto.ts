import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { SignInInput } from '@src/modules/auth/application/use-cases/signin/signin.use-case';

export class SigninDto implements SignInInput {
  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail({}, { message: 'Insira um email válido' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsNotEmpty({ message: 'A senha deve ser preenchida' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @IsString({ message: 'password deve ser do tipo string' })
  password: string;
}
