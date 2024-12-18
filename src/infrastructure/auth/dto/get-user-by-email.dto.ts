import { GetUserByEmailInput } from '@src/application/use-cases/auth/get-user-by-email.use-case';

export class GetUserByEmailDto implements GetUserByEmailInput {
  email: string;
}
