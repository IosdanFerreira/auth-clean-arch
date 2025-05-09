import { SignupInput } from '../signup.use-case';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

class NameValidation implements ValidatorStrategyInterface<SignupInput> {
  validate(input: SignupInput): void {
    if (!input.name) {
      throw new Error('Nome precisa ser informado');
    }

    if (typeof input.name !== 'string') {
      throw new Error('name deve ser do tipo string');
    }
  }
}

class EmailValidation implements ValidatorStrategyInterface<SignupInput> {
  validate(input: SignupInput): void {
    if (!input.email) {
      throw new Error('Email precisa ser informado');
    }

    if (typeof input.email !== 'string') {
      throw new Error('email deve ser do tipo string');
    }
  }
}

class PasswordValidation implements ValidatorStrategyInterface<SignupInput> {
  validate(input: SignupInput): void {
    if (!input.password) {
      throw new Error('A senha precisa ser informada');
    }

    if (typeof input.password !== 'string') {
      throw new Error('password deve ser do tipo string');
    }
  }
}

export class SignupUseCaseValidator
  implements ValidatorStrategyInterface<SignupInput>
{
  strategies: ValidatorStrategyInterface<SignupInput>[] = [];

  constructor() {
    this.strategies = [
      new NameValidation(),
      new EmailValidation(),
      new PasswordValidation(),
    ];
  }

  validate(input: any): void {
    for (const strategy of this.strategies) {
      strategy.validate(input);
    }
  }
}
