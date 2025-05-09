import { v4 as uuidv4 } from 'uuid';

/**
 * Classe abstrata base para entidades do sistema.
 * Esta classe fornece uma estrutura comum para objetos que possuem um identificador único (id)
 * e um conjunto de propriedades (props).
 *
 * @template Props - Tipo das propriedades específicas de cada entidade.
 */
export abstract class Entity<Props = any> {
  private _id: string;

  protected constructor(
    id: string,
    public readonly props: Props,
  ) {
    this._id = id || uuidv4();
    this.props = props;
  }

  /**
   * Retorna o identificador único da entidade.
   *
   * @returns Um identificador único (string) gerado no momento da criação da entidade.
   */
  get id(): string {
    return this._id;
  }

  toJSON(): Record<string, any> {
    return {
      id: this._id,
      ...this.props,
    };
  }
}
