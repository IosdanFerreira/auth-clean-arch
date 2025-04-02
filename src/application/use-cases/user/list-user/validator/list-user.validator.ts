import {
  FieldValidation,
  NumberTypeValidation,
  RequiredFieldValidation,
  SortDirectionValidation,
  StringTypeValidation,
} from '@src/shared/application/validators';

import { MinValueValidation } from '@src/shared/application/validators/min-value-validation.validator';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class ListUsersValidator
  implements ValidatorInterface<Record<string, unknown>>
{
  private validations: FieldValidation[];

  constructor() {
    this.validations = [
      // Validações do campo page
      new FieldValidation('page', [
        new RequiredFieldValidation('Page'),
        new NumberTypeValidation('Page'),
        new MinValueValidation('Page', 1),
      ]),

      // Validações do campo perPage
      new FieldValidation('perPage', [
        new RequiredFieldValidation('PerPage'),
        new NumberTypeValidation('PerPage'),
        new MinValueValidation('PerPage', 1),
      ]),

      // Validações do campo sort (opcional)
      new FieldValidation('sort', [new StringTypeValidation('Sort')]),

      // Validações do campo sortDir (opcional)
      new FieldValidation('sortDir', [new SortDirectionValidation('SortDir')]),

      // Validações do campo filter (opcional)
      new FieldValidation('filter', [new StringTypeValidation('Filter')]),
    ];
  }

  validate(input: Record<string, unknown>): void {
    for (const fieldValidation of this.validations) {
      fieldValidation.validate(input);
    }
  }
}
