import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { SignupInput } from '@src/modules/auth/application/use-cases/signup/signup.use-case';

export class SignupDto implements SignupInput {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString({ message: 'name deve ser do tipo string' })
  @IsNotEmpty({ message: 'Nome deve ser preenchido' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  name: string;

  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail({}, { message: 'Insira um email válido' })
  @IsNotEmpty({ message: 'O email deve ser preenchido' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString({ message: 'password deve ser do tipo string' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @IsNotEmpty({ message: 'A senha deve ser preenchida' })
  password: string;
}
