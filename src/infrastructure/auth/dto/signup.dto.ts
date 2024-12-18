import { SignupInput } from '@src/application/use-cases/auth/signup.use-case';

export class SignupDto implements SignupInput {
  name: string;
  email: string;
  password: string;
}
