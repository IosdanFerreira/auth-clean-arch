import { InvalidParamError } from '../../errors/invalid-param.error';

export class Password {
  private password: string;

  private constructor(password: string) {
    this.password = password;
    Object.freeze(this);
  }

  static create(password: string): Password {
    if (!password) {
      throw new InvalidParamError('Senha é obrigatório');
    }

    if (typeof password !== 'string') {
      throw new InvalidParamError('password deve ser do tipo string');
    }

    const passwordTrimmed = password.trim();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!passwordRegex.test(passwordTrimmed)) {
      throw new InvalidParamError(
        'A senha de conter pelo menos uma letra maiúscula, uma letra minúscula, um número, caractere especial e ter pelo menos 8 caracteres',
      );
    }

    return new Password(passwordTrimmed);
  }

  get value(): string {
    return this.password;
  }

  equals(other: Password): boolean {
    return other instanceof Password && this.password === other.value;
  }
}
