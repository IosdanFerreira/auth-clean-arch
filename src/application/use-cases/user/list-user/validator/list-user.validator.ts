import {
  FieldValidation,
  RequiredFieldValidation,
  SortDirectionValidation,
  StringTypeValidation,
} from '@src/shared/application/validators';

import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class ListUsersValidator
  implements ValidatorInterface<Record<string, unknown>>
{
  private validations: FieldValidation[];

  constructor() {
    this.validations = [
      // Validações do campo page
      new FieldValidation('page', [
        new RequiredFieldValidation('page'),
        new StringTypeValidation('page'),
      ]),

      // Validações do campo perPage
      new FieldValidation('perPage', [
        new RequiredFieldValidation('perPage'),
        new StringTypeValidation('perPage'),
      ]),

      // Validações do campo sort (opcional)
      new FieldValidation('sort', [new StringTypeValidation('sort', true)]),

      // Validações do campo sortDir (opcional)
      new FieldValidation('sortDir', [
        new SortDirectionValidation('sortDir', true),
      ]),

      // Validações do campo filter (opcional)
      new FieldValidation('filter', [new StringTypeValidation('filter', true)]),
    ];
  }

  validate(input: Record<string, unknown>): void {
    for (const fieldValidation of this.validations) {
      fieldValidation.validate(input);
    }
  }
}
