import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { UpdateUserInput } from '@src/application/use-cases/user/update-user/update-user.use-case';

export class UpdateUserDto implements Omit<UpdateUserInput, 'id'> {
  @IsString({ message: 'name deve ser do tipo string' })
  @IsNotEmpty({ message: 'O nome deve ser preenchido' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  name: string;
}
