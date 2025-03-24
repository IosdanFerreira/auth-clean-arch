import { SigninInput } from '@src/application/use-cases/user/signin.use-case';

export class SigninDto implements SigninInput {
  email: string;
  password: string;
}
