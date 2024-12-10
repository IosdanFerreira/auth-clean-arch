import { Entity } from '../entities/entity';
import { NotFoundError } from '../errors/not-found-error';
import { RepositoryInterface } from './repository-contract';

// Define uma classe abstrata que implementa um repositório em memória para armazenar entidades.
// Essa implementação é útil para testes na aplicação
export abstract class InMemoryRepository<T extends Entity>
  implements RepositoryInterface<T>
{
  // Armazena as entidades em um array na memória.
  items: T[] = [];

  /**
   * Insere uma nova entidade no repositório.
   * @param entity - A entidade a ser inserida.
   */
  async insert(entity: T): Promise<void> {
    this.items.push(entity);
  }

  /**
   * Recupera todas as entidades armazenadas no repositório.
   * @returns Uma Promise com um array de todas as entidades.
   */
  async findAll(): Promise<T[]> {
    return this.items;
  }

  /**
   * Busca uma entidade pelo ID.
   * @param id - O ID da entidade a ser buscada.
   * @returns Uma Promise com a entidade encontrada.
   * @throws NotFoundError - Se nenhuma entidade com o ID especificado for encontrada.
   */
  async findByID(id: string): Promise<T> {
    return this._get(id);
  }

  /**
   * Atualiza uma entidade existente no repositório.
   * @param id - O ID da entidade a ser atualizada.
   * @param entity - A entidade com os dados atualizados.
   * @throws NotFoundError - Se nenhuma entidade com o ID especificado for encontrada.
   */
  async update(id: string, entity: T): Promise<void> {
    this._get(id);

    const index = this.items.findIndex((item) => item.id === id);

    this.items[index] = entity;
  }

  /**
   * Remove uma entidade do repositório pelo ID.
   * @param id - O ID da entidade a ser removida.
   * @throws NotFoundError - Se nenhuma entidade com o ID especificado for encontrada.
   */
  async delete(id: string): Promise<void> {
    this._get(id);

    const index = this.items.findIndex((item) => item.id === id);

    this.items.splice(index, 1);
  }

  /**
   * Método protegido para buscar uma entidade pelo ID.
   * @param id - O ID da entidade a ser buscada.
   * @returns A entidade encontrada.
   * @throws NotFoundError - Se nenhuma entidade com o ID especificado for encontrada.
   */
  protected _get(id: string) {
    const entity = this.items.find((item) => item.id === id);

    if (!entity) {
      throw new NotFoundError('Entity not found');
    }

    return entity;
  }
}
