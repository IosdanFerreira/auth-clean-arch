import {
  EmailFormatValidation,
  FieldValidation,
  RequiredFieldValidation,
  StringTypeValidation,
} from '@src/shared/application/validators';

import { SigninInput } from '../signin.use-case';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class SigninValidator implements ValidatorInterface<SigninInput> {
  private validations: FieldValidation[];

  constructor() {
    this.validations = [
      // Validações do campo email
      new FieldValidation('email', [
        new RequiredFieldValidation('Email'),
        new StringTypeValidation('Email'),
        new EmailFormatValidation(),
      ]),
      // Validações do campo password
      new FieldValidation('password', [
        new RequiredFieldValidation('Senha'),
        new StringTypeValidation('Senha'),
      ]),
    ];
  }

  /**
   * Executa todas as validações de campos definidas no construtor.
   *
   * @param input - Os dados a serem validados.
   */
  validate(input: SigninInput): void {
    for (const fieldValidation of this.validations) {
      // Executa a validação do campo.
      fieldValidation.validate(input);
    }
  }
}
