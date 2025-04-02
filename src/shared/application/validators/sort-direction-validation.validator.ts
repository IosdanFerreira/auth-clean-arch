import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { ValidatorInterface } from './validator.interface';

export class SortDirectionValidation implements ValidatorInterface<string> {
  constructor(private readonly fieldName: string) {}

  validate(value: string): void {
    if (value !== 'asc' && value !== 'desc') {
      throw new BadRequestError(`${this.fieldName} deve ser 'asc' ou 'desc'`);
    }
  }
}
