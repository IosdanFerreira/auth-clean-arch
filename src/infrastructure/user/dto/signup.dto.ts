import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { SignupInput } from '@src/application/use-cases/user/signup.use-case';

export class SignupDto implements SignupInput {
  @IsString({ message: 'name deve ser do tipo string' })
  @IsNotEmpty({ message: 'Nome deve ser preenchido' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Insira um email válido' })
  email: string;

  @IsString({ message: 'password deve ser do tipo string' })
  @IsNotEmpty({ message: 'A senha deve ser preenchida' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  password: string;
}
