import { Entity } from '../entities/entity';

// Define uma interface genérica para um repositório, que lida com operações de CRUD.
// O tipo genérico `T` deve ser uma classe que estenda a classe `Entity`.
export interface RepositoryInterface<T extends Entity> {
  insert(entity: T): Promise<void>;
  findAll(): Promise<T[]>;
  findByID(id: string): Promise<T>;
  update(id: string, entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}
