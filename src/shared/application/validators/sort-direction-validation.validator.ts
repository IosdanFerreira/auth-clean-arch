import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { ValidatorInterface } from './validator.interface';

export class SortDirectionValidation implements ValidatorInterface<string> {
  constructor(
    private readonly fieldName: string,
    private readonly isOptional: boolean = false,
  ) {}

  validate(input: string): void {
    if (this.isOptional && (input === null || input === undefined)) {
      return;
    }

    if (input !== 'asc' && input !== 'desc') {
      throw new BadRequestError('', [
        {
          property: this.fieldName,
          message: `${this.fieldName} deve ser 'asc' ou 'desc'`,
        },
      ]);
    }
  }
}
