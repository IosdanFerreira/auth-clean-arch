import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { SignupInput } from '@src/application/use-cases/auth/signup/signup.use-case';

export class SignupDto implements SignupInput {
  @IsString({ message: 'name deve ser do tipo string' })
  @IsNotEmpty({ message: 'Nome deve ser preenchido' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Insira um email válido' })
  @IsNotEmpty({ message: 'O email deve ser preenchido' })
  email: string;

  @IsString({ message: 'password deve ser do tipo string' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @IsNotEmpty({ message: 'A senha deve ser preenchida' })
  password: string;
}
