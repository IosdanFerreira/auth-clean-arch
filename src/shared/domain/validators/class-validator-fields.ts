import { validateSync } from 'class-validator';
import { FieldsErrors, IValidatorFields } from './validator-fields.interface';

/**
 * Classe abstrata que utiliza o `class-validator` para validação de campos.
 *
 * @template PropsValidated - Tipo dos dados validados.
 */
export abstract class ClassValidatorFields<PropsValidated>
  implements IValidatorFields<PropsValidated>
{
  /**
   * Armazena os erros de validação, se existirem.
   * O formato segue a interface `FieldsErrors`, onde cada chave representa um campo com uma lista de mensagens de erro.
   */
  errors: FieldsErrors = null;

  /**
   * Armazena os dados validados, caso a validação seja bem-sucedida.
   *
   * @type {PropsValidated | null}
   */
  validatedData: PropsValidated = null;

  /**
   * Realiza a validação dos dados fornecidos utilizando o `class-validator`.
   *
   * @param data - Os dados que serão validados.
   * @returns `true` se os dados forem válidos; caso contrário, `false`.
   */
  validate(data: any): boolean {
    const errors = validateSync(data); // Realiza a validação síncrona dos dados.

    // Caso existam erros de validação, processa e armazena cada erro.
    if (errors.length) {
      this.errors = {};

      for (const error of errors) {
        const field = error.property;

        // Armazena os erros para o campo atual no formato { campo: [mensagens de erro] }
        this.errors[field] = Object.values(error.constraints);
      }
    } else {
      // Caso não existam erros, armazena os dados validados.
      this.validatedData = data;
    }

    // Retorna `true` se não houverem erros, ou `false` caso contrário.
    return !errors.length;
  }
}
