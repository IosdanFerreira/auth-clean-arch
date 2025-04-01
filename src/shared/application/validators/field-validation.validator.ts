import { ValidatorInterface } from './validator.interface';

export class FieldValidation implements ValidatorInterface<any> {
  /**
   * Uma classe de validação de campo.
   *
   * Essa classe é usada para validar um campo em um objeto.
   * @param fieldName - O nome do campo a ser validado.
   * @param rules - As regras de validação a serem aplicadas ao campo.
   */
  constructor(
    /**
     * O nome do campo a ser validado.
     */
    readonly fieldName: string,

    /**
     * As regras de validação a serem aplicadas ao campo.
     */
    private readonly rules: ValidatorInterface<any>[],
  ) {}

  /**
   * Valida o campo com as regras especificadas.
   *
   * @param input - O objeto que contém o campo a ser validado.
   */
  validate(input?: Record<string, unknown>): void {
    for (const rule of this.rules) {
      rule.validate(input?.[this.fieldName]);
    }
  }
}
