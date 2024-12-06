/**
 * Representa os erros de validação de campos.
 *
 * O tipo `FieldsErrors` é um objeto onde cada chave é o nome de um campo, e o valor
 * é uma lista de mensagens de erro associadas a esse campo.
 */
export type FieldsErrors = {
  [field: string]: string[];
};

/**
 * Interface para classes que implementam a validação de campos.
 *
 * @template PropsValidated - Tipo dos dados que serão validados.
 */
export interface IValidatorFields<PropsValidated> {
  /**
   * Objeto contendo os erros de validação.
   *
   * Cada campo possui uma lista de mensagens de erro descrevendo os problemas encontrados.
   */
  errors: FieldsErrors;

  /**
   * Dados validados com sucesso.
   *
   * Será populado apenas se a validação for bem-sucedida.
   */
  validatedData: PropsValidated;

  /**
   * Realiza a validação dos dados fornecidos.
   *
   * @param data - Dados que serão validados.
   * @returns `true` se os dados forem válidos; caso contrário, `false`.
   */
  validate(data: any): boolean;
}
