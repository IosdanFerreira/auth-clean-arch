import { BadRequestError } from '@src/shared/domain/errors/bad-request.error';
import { UpdateUserInput } from '../update-user.use-case';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

class NameValidation implements ValidatorStrategyInterface<UpdateUserInput> {
  validate(input: UpdateUserInput): void {
    if (input.name && typeof input.name !== 'string') {
      throw new BadRequestError('name deve ser do tipo string');
    }
  }
}

class EmailValidation implements ValidatorStrategyInterface<UpdateUserInput> {
  validate(input: UpdateUserInput): void {
    if (input.email && typeof input.email !== 'string') {
      throw new BadRequestError('email deve ser do tipo string');
    }
  }
}

export class UpdateUserUseCaseValidator
  implements ValidatorStrategyInterface<UpdateUserInput>
{
  strategies: ValidatorStrategyInterface<UpdateUserInput>[] = [];

  constructor() {
    this.strategies = [new NameValidation(), new EmailValidation()];
  }

  validate(input: UpdateUserInput): void {
    for (const strategy of this.strategies) {
      strategy.validate(input);
    }
  }
}
