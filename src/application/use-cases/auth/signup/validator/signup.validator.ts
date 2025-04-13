import {
  EmailFormatValidation,
  FieldValidation,
  RequiredFieldValidation,
  StringTypeValidation,
} from '@src/shared/application/validators';

import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { SignupInput } from '../signup.use-case';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class PasswordStrengthValidation implements ValidatorInterface<string> {
  /**
   * Valida a força da senha.
   *
   * Garante que a senha tenha pelo menos um número, uma letra minúscula,
   * uma letra maiúscula, um caractere especial e tenha pelo menos 8 caracteres
   *
   * @param value - A senha a ser validada.
   * @throws BadRequestError se a senha não atender aos requisitos de validação.
   */
  validate(value: string): void {
    // Regular expression to check password criteria
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

    // Test the password against the regex
    if (!passwordRegex.test(value)) {
      throw new BadRequestError('', [
        {
          property: 'password',
          message:
            'Senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos',
        },
      ]);
    }
  }
}

export class SignupValidator implements ValidatorInterface<SignupInput> {
  private validations: FieldValidation[];

  constructor() {
    this.validations = [
      // Validações do campo name
      new FieldValidation('name', [
        new RequiredFieldValidation('Nome'),
        new StringTypeValidation('Nome'),
      ]),
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
        new PasswordStrengthValidation(),
      ]),
    ];
  }

  /**
   * Executa todas as validações de campos definidas no construtor.
   *
   * @param input - Os dados a serem validados.
   */
  validate(input: SignupInput): void {
    for (const fieldValidation of this.validations) {
      // Executa a validação do campo.
      fieldValidation.validate(input);
    }
  }
}
