import { BadRequestError } from '@src/shared/domain/errors';
import { ValidatorInterface } from './validator.interface';

export class MinValueValidation implements ValidatorInterface<number> {
  constructor(
    private readonly fieldName: string,
    private readonly minValue: number,
  ) {}

  /**
   * Valida o valor mínimo do campo.
   *
   * @param value - O valor a ser validado.
   * @throws BadRequestError - Se o valor for menor que o valor mínimo.
   */
  validate(value: number): void {
    // Verifica se o valor e um n mero
    if (typeof value !== 'number') {
      throw new BadRequestError('', [
        {
          property: this.fieldName,
          message: `${this.fieldName} deve ser do tipo number`,
        },
      ]);
    }

    // Verifica se o valor é menor que o valor mínimo
    if (value < this.minValue) {
      throw new BadRequestError('', [
        {
          property: this.fieldName,
          message: `${this.fieldName} deve ser maior ou igual ${this.minValue}`,
        },
      ]);
    }
  }
}
