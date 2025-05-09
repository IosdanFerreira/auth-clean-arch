import { BadRequestError } from '@src/shared/domain/errors/bad-request.error';
import { GetUserByEmailInput } from '../get-user-by-email.use-case';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

class EmailValidation
  implements ValidatorStrategyInterface<GetUserByEmailInput>
{
  validate(input: GetUserByEmailInput): void {
    if (!input.email) {
      throw new BadRequestError('O email precisa ser informado');
    }

    if (typeof input.email !== 'string') {
      throw new BadRequestError('email deve ser do tipo string');
    }
  }
}

export class GetUserByEmailUseCaseValidator
  implements ValidatorStrategyInterface<GetUserByEmailInput>
{
  strategies: ValidatorStrategyInterface<GetUserByEmailInput>[] = [];

  constructor() {
    this.strategies = [new EmailValidation()];
  }

  validate(input: GetUserByEmailInput): void {
    for (const strategy of this.strategies) {
      strategy.validate(input);
    }
  }
}
