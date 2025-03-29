import { GetUserByEmailInput } from '@src/application/use-cases/user/get-user-by-email.use-case';
import { IsEmail } from 'class-validator';

export class GetUserByEmailDto implements GetUserByEmailInput {
  @IsEmail({}, { message: 'Insira um email válido' })
  email: string;
}
