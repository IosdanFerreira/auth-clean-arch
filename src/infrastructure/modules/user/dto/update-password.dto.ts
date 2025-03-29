import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'oldPassword deve ser do tipo string' })
  @IsNotEmpty({ message: 'A confirmação de senha deve ser preenchida' })
  @MinLength(8, {
    message: 'A confirmação de senha deve ter pelo menos 8 caracteres',
  })
  oldPassword: string;

  @IsString({ message: 'password deve ser do tipo string' })
  @IsNotEmpty({ message: 'A senha deve ser preenchida' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  password: string;
}
