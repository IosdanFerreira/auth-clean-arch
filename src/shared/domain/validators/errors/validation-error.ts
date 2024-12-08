import { FieldsErrors } from '../validator-fields.interface';

/**
 * Classe base para representar erros de validação.
 *
 * Essa classe herda de Error e serve como um tipo genérico para erros de validação,
 * podendo ser estendida para casos mais específicos.
 */
export class ValidationError extends Error {}

/**
 * Classe que representa erros de validação específicos para entidades do domínio.
 *
 * Essa classe herda de Error e inclui informações detalhadas sobre os erros nos campos
 * da entidade que não passaram na validação.
 */
export class EntityValidationError extends Error {
  /**
   * Construtor da classe EntityValidationError.
   *
   * @param error - Um objeto do tipo FieldsErrors contendo as mensagens de erro
   * associadas a cada campo inválido na entidade.
   */
  constructor(public error: FieldsErrors) {
    // Chama o construtor da classe base (Error) e define uma mensagem fixa para o erro.
    super('Entity validation error');

    // Define o nome do erro como 'EntityValidationError', facilitando sua identificação.
    this.name = 'EntityValidationError';
  }
}
