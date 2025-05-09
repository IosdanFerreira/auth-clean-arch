import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { InvalidParamError } from '@src/shared/domain/errors/invalid-param.error';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { UserEntityProps } from '../user.entity';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces/validator-strategy.interface';

export class OptionalUserNameValidation
  implements ValidatorStrategyInterface<Partial<UserEntityProps>>
{
  validate(userProps: Partial<UserEntityProps>): void {
    if (userProps.name && !(userProps.name instanceof Name)) {
      throw new InvalidParamError('Nome deve ser uma instância de Name');
    }
  }
}

export class OptionalUserEmailValidation
  implements ValidatorStrategyInterface<Partial<UserEntityProps>>
{
  validate(userProps: Partial<UserEntityProps>): void {
    if (userProps.email && !(userProps.email instanceof Email)) {
      throw new InvalidParamError('Email deve ser uma instância de Email');
    }
  }
}

export class UpdateUserValidator {
  private strategies: ValidatorStrategyInterface<Partial<UserEntityProps>>[];

  constructor() {
    this.strategies = [
      new OptionalUserNameValidation(),
      new OptionalUserEmailValidation(),
    ];
  }

  validate(userProps: Partial<UserEntityProps>): void {
    if (!userProps) {
      throw new InvalidParamError('userProps é obrigatório');
    }

    for (const strategy of this.strategies) {
      strategy.validate(userProps);
    }
  }
}
