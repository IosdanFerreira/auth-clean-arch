import {
  FieldValidation,
  RequiredFieldValidation,
  StringTypeValidation,
} from '@src/shared/application/validators';

import { UpdateUserInput } from '../update-user.use-case';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class UpdateUserValidator
  implements ValidatorInterface<UpdateUserInput>
{
  private validations: FieldValidation[];

  constructor() {
    this.validations = [
      // Validações do campo email
      new FieldValidation('name', [
        new RequiredFieldValidation('Nome'),
        new StringTypeValidation('Nome'),
      ]),
      new FieldValidation('id', [new RequiredFieldValidation('ID')]),
    ];
  }

  validate(input: UpdateUserInput): void {
    for (const fieldValidation of this.validations) {
      // Executa a validação do campo.
      fieldValidation.validate(input);
    }
  }
}
