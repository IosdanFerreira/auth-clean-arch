import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { ValidatorInterface } from './validator.interface';

export class MinValueValidation implements ValidatorInterface<number> {
  constructor(
    private readonly fieldName: string,
    private readonly minValue: number,
  ) {}

  validate(value: number): void {
    if (typeof value !== 'number') {
      throw new BadRequestError('', [
        {
          property: this.fieldName,
          message: `${this.fieldName} deve ser do tipo number`,
        },
      ]);
    }

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
