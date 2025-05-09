import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserInput } from '../../application/use-cases/update-user/update-user.use-case';

export class UpdateUserDto implements Omit<UpdateUserInput, 'id'> {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString({ message: 'name deve ser do tipo string' })
  @IsOptional()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsString({ message: 'name deve ser do tipo string' })
  @IsOptional()
  @IsEmail({}, { message: 'Insira um email válido' })
  email: string;
}
