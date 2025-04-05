import {
  UserRepositoryInterface,
  UserSearchParams,
  UserSearchResults,
} from '@src/domain/repositories/user.repository';

import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/shared/infrastructure/database/prisma/prisma.service';
import { SearchResult } from '@src/shared/domain/repositories/searchable-repository-contract';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserModelMapper } from '../models/user-model.mapper';

export class AuthRepositoryDatabase implements UserRepositoryInterface {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Retrieves a user entity by its email address.
   * @param email - The email address to search for.
   * @returns A promise that resolves to the UserEntity.
   * @throws {NotFoundError} If the user is not found.
   */
  async findByEmail(email: string): Promise<UserEntity> {
    // Query the database to find a user by the given email
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    // If the user is not found, return null
    if (!user) {
      return null;
    }

    // Map the retrieved user model to a UserEntity
    return UserModelMapper.toEntity(user);
  }

  /**
   * Retrieves a list of user entities that match the given search criteria.
   * @param props - The search criteria.
   * @returns A promise that resolves to a SearchResult containing the search results.
   */
  async search(props: UserSearchParams): Promise<UserSearchResults> {
    // console.log(props);
    // Valores padrão
    const page = props.page && props.page > 0 ? props.page : 1;
    const perPage = props.perPage && props.perPage > 0 ? props.perPage : 15;

    // Construir o WHERE clause com tipagem correta
    const where = props.filter
      ? {
          OR: [
            {
              name: {
                contains: props.filter,
                mode: 'insensitive' as const,
              },
            },
            {
              email: {
                contains: props.filter,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    // Lógica de ordenação 100% funcional
    const orderBy: Prisma.UserOrderByWithRelationInput = {};

    if (props.sort && this.sortableFields.includes(props.sort)) {
      const sortField = props.sort;
      const sortOrder = props.sortDir === 'asc' ? 'asc' : 'desc';

      // Atribuição dinâmica com notação de colchetes
      orderBy[sortField as keyof Prisma.UserOrderByWithRelationInput] =
        sortOrder;
    } else {
      // Ordenação padrão
      orderBy.createdAt = 'desc';
    }

    // Consulta com ordenação garantida
    const [totalItems, models] = await Promise.all([
      this.prismaService.user.count({ where }),
      this.prismaService.user.findMany({
        where,
        orderBy, // Agora garantido que funciona
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    return new SearchResult({
      items: models.map(UserModelMapper.toEntity),
      totalItems,
      currentPage: page,
      perPage,
      sort: props.sort,
      sortDir: props.sortDir || 'desc',
      filter: props.filter,
    });
  }

  /**
   * Inserts a new user entity into the database.
   * @param entity - The user entity to be inserted.
   * @returns A promise that resolves when the insertion is complete.
   */
  async insert(entity: UserEntity): Promise<void> {
    // Use the Prisma service to create a new user record in the database
    await this.prismaService.user.create({
      data: entity.toJSON(), // Convert the user entity to a JSON object for database insertion
    });
  }

  /**
   * Retrieves all user entities from the database.
   * @returns A promise that resolves to an array of UserEntity.
   */
  async findAll(): Promise<UserEntity[]> {
    // Retrieve all user entities from the database
    const users = await this.prismaService.user.findMany();

    // Map the retrieved user models to UserEntity
    return users.map((user) => UserModelMapper.toEntity(user));
  }

  /**
   * Retrieves a user entity from the database by its unique identifier.
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to the UserEntity.
   */
  async findByID(id: string): Promise<UserEntity> {
    // Retrieve the user entity from the database
    const user = await this._get(id);

    // Return the user entity
    return user;
  }

  /**
   * Updates a user entity in the database.
   * @param id - The unique identifier of the user.
   * @param entity - The updated user entity.
   */
  async update(id: string, entity: UserEntity): Promise<void> {
    // Retrieve the user entity from the database
    const user = await this._get(id);

    // Update the user entity in the database
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: entity.toJSON(),
    });
  }

  /**
   * Deletes a user entity from the database.
   * @param id - The unique identifier of the user.
   */
  async delete(id: string): Promise<void> {
    const user = await this._get(id);

    // Remove the user from the database
    await this.prismaService.user.delete({
      where: {
        id: user.id,
      },
    });
  }

  /**
   * Retrieves a user entity by its unique ID.
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to the UserEntity.
   */
  protected async _get(id: string): Promise<UserEntity> {
    // Query the database to find a user by their unique ID
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }
    // Map the retrieved user model to a UserEntity
    return UserModelMapper.toEntity(user);
  }
}
