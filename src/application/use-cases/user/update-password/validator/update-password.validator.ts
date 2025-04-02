import {
  FieldValidation,
  RequiredFieldValidation,
  StringTypeValidation,
} from '@src/shared/application/validators';

import { PasswordStrengthValidation } from '../../signup/validator/signup.validator';
import { UpdatePasswordInput } from '../update-password.use-case';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class UpdatePasswordValidator
  implements ValidatorInterface<UpdatePasswordInput>
{
  private validations: FieldValidation[];

  constructor() {
    this.validations = [
      // Validações do campo email
      new FieldValidation('id', [new RequiredFieldValidation('ID')]),
      new FieldValidation('oldPassword', [
        new RequiredFieldValidation('Senha antiga'),
        new StringTypeValidation('Senha antiga'),
      ]),
      new FieldValidation('password', [
        new RequiredFieldValidation('Nova senha'),
        new StringTypeValidation('Nova senha'),
        new PasswordStrengthValidation(),
      ]),
    ];
  }

  validate(input: UpdatePasswordInput): void {
    for (const fieldValidation of this.validations) {
      // Executa a validação do campo.
      fieldValidation.validate(input);
    }
  }
}
