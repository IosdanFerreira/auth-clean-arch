import { updatePasswordInput } from '@src/application/use-cases/auth/update-password.use-case';

export class UpdatePasswordDto implements Omit<updatePasswordInput, 'id'> {
  password: string;
  oldPassword: string;
}
