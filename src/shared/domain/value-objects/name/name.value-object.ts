import { InvalidParamError } from '../../errors/invalid-param.error';

export class Name {
  private name: string;

  private constructor(name: string) {
    this.name = name;
    Object.freeze(this);
  }

  static create(name: string): Name {
    // Regex que permite letras com acento
    const nameRegex = /^([A-ZÀ-Ý][a-zà-ÿ']{2,})(?:\s[A-ZÀ-Ý][a-zà-ÿ']{2,})*$/;

    if (!name) {
      throw new InvalidParamError('Nome é obrigatório', [
        { property: 'name', message: 'O nome deve ser preenchido' },
      ]);
    }

    if (typeof name !== 'string') {
      throw new InvalidParamError('name deve ser do tipo string', [
        { property: 'name', message: 'name deve ser do tipo string' },
      ]);
    }

    const nameTrimmed = name.trim();

    if (!nameRegex.test(nameTrimmed)) {
      throw new InvalidParamError('Nome inválido com formato inválido', [
        {
          property: 'name',
          message:
            'O nome deve conter pelo menos 3 caracteres e a primeira letra maiúscula',
        },
      ]);
    }

    return new Name(nameTrimmed);
  }

  get value(): string {
    return this.name;
  }

  equals(other: Name): boolean {
    return other instanceof Name && this.name === other.value;
  }
}
