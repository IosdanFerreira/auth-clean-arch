import { BadRequestError } from '@src/shared/domain/errors';
import { ValidatorInterface } from './validator.interface';

export class SortDirectionValidation implements ValidatorInterface<string> {
  /**
   * Cria uma instância de SortDirectionValidation.
   *
   * @param fieldName - O nome do campo a ser validado.
   * @param isOptional - Se o campo é opcional ou não.
   */
  constructor(
    private readonly fieldName: string,
    private readonly isOptional: boolean = false,
  ) {}

  /**
   * Valida se o input fornecido e um dos valores permitidos ('asc' ou 'desc').
   *
   * Se o input for null ou undefined, e o campo for opcional, retorna sem fazer nada.
   * Se o input for diferente de 'asc' ou 'desc', lança um erro.
   * @param input - Input a ser validado.
   * @throws BadRequestError - Se o input tiver um valor inválido.
   */
  validate(input: string): void {
    if (this.isOptional && (input === null || input === undefined)) {
      return;
    }

    if (input !== 'asc' && input !== 'desc') {
      throw new BadRequestError('', [
        {
          property: this.fieldName,
          message: `${this.fieldName} deve ser 'asc' ou 'desc'`,
        },
      ]);
    }
  }
}
