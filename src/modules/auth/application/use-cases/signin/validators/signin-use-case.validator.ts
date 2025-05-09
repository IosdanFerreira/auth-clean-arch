import { SignInInput } from '../signin.use-case';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

class EmailValidation implements ValidatorStrategyInterface<SignInInput> {
  validate(input: SignInInput): void {
    if (!input.email) {
      throw new Error('Email precisa ser informado');
    }

    if (typeof input.email !== 'string') {
      throw new Error('email deve ser do tipo string');
    }
  }
}

class PasswordValidation implements ValidatorStrategyInterface<SignInInput> {
  validate(input: SignInInput): void {
    if (!input.password) {
      throw new Error('A senha precisa ser informada');
    }

    if (typeof input.password !== 'string') {
      throw new Error('password deve ser do tipo string');
    }
  }
}

export class SigninUseCaseValidator
  implements ValidatorStrategyInterface<SignInInput>
{
  strategies: ValidatorStrategyInterface<SignInInput>[] = [];

  constructor() {
    this.strategies = [new EmailValidation(), new PasswordValidation()];
  }

  validate(input: any): void {
    for (const strategy of this.strategies) {
      strategy.validate(input);
    }
  }
}
