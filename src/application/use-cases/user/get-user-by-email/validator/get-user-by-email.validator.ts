import {
  EmailFormatValidation,
  FieldValidation,
  RequiredFieldValidation,
  StringTypeValidation,
} from '@src/shared/application/validators';

import { GetUserByEmailInput } from '../get-user-by-email.use-case';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class GetUserByEmailValidator
  implements ValidatorInterface<GetUserByEmailInput>
{
  private validations: FieldValidation[];

  constructor() {
    this.validations = [
      // Validações do campo email
      new FieldValidation('email', [
        new RequiredFieldValidation('Email'),
        new StringTypeValidation('Email'),
        new EmailFormatValidation(),
      ]),
    ];
  }

  validate(input: GetUserByEmailInput): void {
    for (const fieldValidation of this.validations) {
      // Executa a validação do campo.
      fieldValidation.validate(input);
    }
  }
}
