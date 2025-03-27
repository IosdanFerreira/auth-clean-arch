import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { updatePasswordInput } from '@src/application/use-cases/user/update-password.use-case';

export class UpdatePasswordDto implements Omit<updatePasswordInput, 'id'> {
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
