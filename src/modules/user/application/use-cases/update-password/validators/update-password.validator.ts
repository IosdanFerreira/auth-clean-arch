import { BadRequestError } from '@src/shared/domain/errors/bad-request.error';
import { UpdatePasswordInput } from '../update-password.use-case';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

class OldPasswordValidation
  implements ValidatorStrategyInterface<UpdatePasswordInput>
{
  validate(input: UpdatePasswordInput): void {
    if (!input.oldPassword) {
      throw new BadRequestError('A senha antiga precisa ser informada');
    }

    if (typeof input.oldPassword !== 'string') {
      throw new BadRequestError('oldPassword deve ser do tipo string');
    }
  }
}

class NewPasswordValidation
  implements ValidatorStrategyInterface<UpdatePasswordInput>
{
  validate(input: UpdatePasswordInput): void {
    if (!input.newPassword) {
      throw new BadRequestError('A nova senha precisa ser informada');
    }

    if (typeof input.newPassword !== 'string') {
      throw new BadRequestError('newPassword deve ser do tipo string');
    }
  }
}

export class UpdatePasswordUseCaseValidator
  implements ValidatorStrategyInterface<UpdatePasswordInput>
{
  strategies: ValidatorStrategyInterface<UpdatePasswordInput>[] = [];

  constructor() {
    this.strategies = [
      new OldPasswordValidation(),
      new NewPasswordValidation(),
    ];
  }

  validate(input: UpdatePasswordInput): void {
    for (const strategy of this.strategies) {
      strategy.validate(input);
    }
  }
}
