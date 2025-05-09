import { BadRequestError } from '@src/shared/domain/errors';
import { ValidatorInterface } from './validator.interface';

export class EmailFormatValidation implements ValidatorInterface<string> {
  /**
   * Verifica se o e-mail tem um formato válido.
   *
   * Valida se o e-mail tem o formato:
   * - sem espaços no início ou no final
   * - tem um '@' no meio
   * - tem um '.' no final
   *
   * @param input - E-mail a ser validado
   * @throws BadRequestError - Se o e-mail tiver um formato inválido
   */
  validate(input: string): void {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(input)) {
      throw new BadRequestError('', [
        { property: 'email', message: 'Email inválido' },
      ]);
    }
  }
}
