import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { SigninInput } from '@src/application/use-cases/user/signin.use-case';

export class SigninDto implements SigninInput {
  @IsEmail({}, { message: 'Insira um email válido' })
  email: string;

  @IsString({ message: 'password deve ser do tipo string' })
  @IsNotEmpty({ message: 'A senha deve ser preenchida' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  password: string;
}
