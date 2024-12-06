import { Entity } from '@src/shared/domain/entities/entity';

// Tipo que define as propriedades de um usuário.
export type UserEntityProps = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Classe que representa uma entidade de usuário.
 * Herda da classe `Entity` e define as propriedades e comportamentos específicos para um usuário.
 */
export class UserEntity extends Entity<UserEntityProps> {
  /**
   * Inicializa as propriedades do usuário, garantindo que as datas de criação e atualização sejam definidas.
   *
   * @param userEntityProps - Propriedades do usuário.
   * @param id - Identificador opcional. Se não for fornecido, um ID único será gerado automaticamente.
   */
  constructor(
    public readonly props: UserEntityProps,
    id?: string,
  ) {
    // Chama o construtor da classe pai (`Entity`) para inicializar as propriedades e o ID.
    super(props, id);

    // Garante que a data de criação seja definida se não fornecida.
    this.props.createdAt = this.props.createdAt ?? new Date();

    // Garante que a data de atualização seja definida se não fornecida.
    this.props.updatedAt = this.props.updatedAt ?? new Date();
  }

  /**
   * Getter para o nome do usuário.
   * Retorna o nome do usuário.
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * Setter para o nome do usuário.
   * Define um novo nome para o usuário.
   *
   * @param newName - Novo nome do usuário.
   */
  private set name(newName: string) {
    this.props.name = newName;
    this.updateTimestamp();
  }

  /**
   * Getter para o email do usuário.
   * Retorna o email do usuário.
   */
  get email(): string {
    return this.props.email;
  }

  /**
   * Getter para a senha do usuário.
   * Retorna a senha do usuário.
   */
  get password(): string {
    return this.props.password;
  }

  /**
   * * Setter para a senha do usuário.
   * Define uma nova senha para o usuário.
   *
   * @param newPassword - Nova senha do usuário.
   */
  private set password(newPassword: string) {
    this.props.password = newPassword;
    this.updateTimestamp();
  }

  /**
   * Getter para a data de criação do usuário.
   * Retorna a data de criação do usuário.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Getter para a data de atualização do usuário.
   * Retorna a data de atualização do usuário.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Atualiza o timestamp da propriedade `updatedAt` para o momento atual.
   * Este método é usado internamente pelos setters para registrar alterações.
   */
  private updateTimestamp() {
    this.props.updatedAt = new Date();
  }
}
