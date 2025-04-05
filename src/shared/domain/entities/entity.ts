import { v4 as uuidv4 } from 'uuid';

/**
 * Classe abstrata base para entidades do sistema.
 * Esta classe fornece uma estrutura comum para objetos que possuem um identificador único (_id)
 * e um conjunto de propriedades (props).
 *
 * @template Props - Tipo das propriedades específicas de cada entidade.
 */
export abstract class Entity<Props = any> {
  // Identificador único da entidade
  private readonly _id: string;

  // Propriedades da entidade, que são passadas no momento da criação
  public readonly props: Props;

  /**
   * Construtor da entidade.
   * Inicializa as propriedades e o ID. Se um ID não for fornecido, é gerado um ID único utilizando UUID.
   *
   * @param props - Propriedades específicas da entidade.
   * @param id - Identificador opcional. Caso não seja fornecido, um ID único será gerado.
   */
  constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id || uuidv4();
  }

  /**
   * Getter para o ID da entidade.
   * Retorna o ID único da entidade.
   */
  get id() {
    return this._id;
  }

  /**
   * Método para converter a entidade para um objeto JSON.
   * O objeto retornado inclui o ID da entidade junto com suas propriedades.
   *
   * @returns Um objeto JSON representando a entidade, com um campo "id" obrigatório.
   */
  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this._id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
