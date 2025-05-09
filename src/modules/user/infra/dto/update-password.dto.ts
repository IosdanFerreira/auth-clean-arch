import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { UpdatePasswordInput } from '../../application/use-cases/update-password/update-password.use-case';

export class UpdatePasswordDto implements Omit<UpdatePasswordInput, 'id'> {
  @ApiProperty({ description: 'Senha antiga' })
  @IsString({ message: 'oldPassword deve ser do tipo string' })
  @IsNotEmpty({ message: 'A confirmação de senha deve ser preenchida' })
  @MinLength(8, {
    message: 'A confirmação de senha deve ter pelo menos 8 caracteres',
  })
  oldPassword: string;

  @ApiProperty({ description: 'Nova senha' })
  @IsString({ message: 'password deve ser do tipo string' })
  @IsNotEmpty({ message: 'A senha deve ser preenchida' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  newPassword: string;
}
