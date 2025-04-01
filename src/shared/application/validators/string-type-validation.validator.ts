import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { ValidatorInterface } from './validator.interface';

export class StringTypeValidation implements ValidatorInterface<string> {
  constructor(private readonly fieldName: string) {}

  /**
   * Valida se o input fornecido é uma string.
   *
   * @param input - input a ser validado.
   * @throws BadRequestError - Se o input não for do tipo string.
   */
  validate(input: string): void {
    if (typeof input !== 'string') {
      // Lança um erro se o input fornecido não for uma string
      throw new BadRequestError(`${this.fieldName} deve ser uma string`);
    }
  }
}
