import { GetUserByEmailInput } from '@src/application/use-cases/user/get-user-by-email.use-case';

export class GetUserByEmailDto implements GetUserByEmailInput {
  email: string;
}
