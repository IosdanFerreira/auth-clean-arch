import { InvalidParamError } from '../../errors/invalid-param.error';

export class Email {
  private email: string;

  private constructor(email: string) {
    this.email = email;
    Object.freeze(this);
  }

  static create(email: string): Email {
    if (!email) {
      throw new InvalidParamError('Email é obrigatório');
    }

    if (typeof email !== 'string') {
      throw new InvalidParamError('email deve ser do tipo string');
    }

    const emailTrimmed = email.trim();

    if (emailTrimmed.includes('..')) {
      throw new InvalidParamError('Email com formato inválido');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(emailTrimmed)) {
      throw new InvalidParamError('Email com formato inválido');
    }

    return new Email(emailTrimmed);
  }

  get value(): string {
    return this.email;
  }

  equals(other: Email): boolean {
    return other instanceof Email && this.email === other.value;
  }
}
