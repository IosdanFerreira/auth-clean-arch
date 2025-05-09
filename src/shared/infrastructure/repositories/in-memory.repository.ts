import { Entity } from '@src/shared/domain/entities/Entity';
import { RepositoryContractInterface } from '@src/shared/domain/interfaces';

export class InMemoryRepository<T extends Entity>
  implements RepositoryContractInterface<T>
{
  items: T[] = [];

  /**
   * Inserts a new entity in the repository.
   *
   * @param {T} entity - The entity to be inserted
   * @returns {Promise<void>} - A promise that resolves when the entity is inserted
   */
  async insert(entity: T): Promise<void> {
    // Add the entity to the list of items
    this.items.push(entity);
  }

  /**
   * Finds an entity by its ID.
   *
   * @param {string} id - The ID of the entity to be found
   * @returns {Promise<T>} - A promise that resolves with the entity if found
   * @throws {NotFoundError} - If the entity is not found
   */
  async findByID(id: string): Promise<T> {
    return this._get(id);
  }

  /**
   * Updates an existing entity in the repository.
   *
   * @param {string} id - The ID of the entity to be updated
   * @param {T} entity - The updated entity
   * @returns {Promise<void>} - A promise that resolves when the entity is updated
   */
  async update(id: string, entity: T): Promise<void> {
    this._get(id);

    // Replace the existing entity with the updated one
    const index = this.items.findIndex((item) => item.id === id);

    this.items[index] = entity;
  }

  /**
   * Finds all entities in the repository.
   *
   * @returns {Promise<T[]>} - A promise that resolves with all the entities
   */
  async findAll(): Promise<T[]> {
    return this.items;
  }
  async delete(id: string): Promise<void> {
    this._get(id);

    const index = this.items.findIndex((item) => item.id === id);

    this.items.splice(index, 1);
  }

  /**
   * Internal method to get an entity by ID.
   * @param {string} id - The ID of the entity to be found
   * @returns {T} - The entity if found
   * @throws {NotFoundError} - If the entity is not found
   * @private
   */
  protected _get(id: string): T {
    // Find the entity in the list of items
    const entity = this.items.find((item) => item.id === id);

    // If the entity is not found, throw an error
    if (!entity) {
      throw new Error('Entity not found');
    }

    // Return the entity
    return entity;
  }
}
