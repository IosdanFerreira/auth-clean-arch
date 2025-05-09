import { BadRequestError } from '@src/shared/domain/errors';
import { ValidatorInterface } from './validator.interface';

export class NumberTypeValidation implements ValidatorInterface<string> {
  constructor(private readonly fieldName: string) {}

  /**
   * Valida se o input fornecido é um número.
   *
   * @param input - input a ser validado.
   * @throws BadRequestError - Se o input não for do tipo number.
   */
  validate(input: string): void {
    if (typeof input !== 'number') {
      // Lança um erro se o input fornecido não for um número
      throw new BadRequestError('', [
        {
          property: this.fieldName,
          message: `${this.fieldName} deve ser do tipo number`,
        },
      ]);
    }
  }
}
