import {
  UserRepository,
  UserSearchParams,
  UserSearchResults,
} from '@src/domain/repositories/user.repository';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { PrismaService } from '@src/shared/infrastructure/database/prisma/prisma.service';
import { UserModelMapper } from '../models/user-model.mapper';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { SearchResult } from '@src/shared/domain/repositories/searchable-repository-contract';

export class AuthRepositoryDatabase implements UserRepository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Retrieves a user entity by its email address.
   * @param email - The email address to search for.
   * @returns A promise that resolves to the UserEntity.
   * @throws {NotFoundError} If the user is not found.
   */
  async findByEmail(email: string): Promise<UserEntity> {
    try {
      // Query the database to find a user by the given email
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      // Map the retrieved user model to a UserEntity
      return UserModelMapper.toEntity(user);
    } catch {
      // If the user is not found, throw a NotFoundError
      throw new NotFoundError('User not found');
    }
  }

  /**
   * Verifies if a given email address is already in use.
   * @param email - The email address to verify.
   * @returns A promise that resolves if the email address is not in use.
   * @throws {Error} If the email address is already in use.
   */
  async emailExist(email: string): Promise<void> {
    // Query the database to find a user by the given email
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    // If the user is found, throw an error
    if (user) {
      throw new Error('Email already exist');
    }
  }

  /**
   * Retrieves a list of user entities that match the given search criteria.
   * @param props - The search criteria.
   * @returns A promise that resolves to a SearchResult containing the search results.
   */
  async search(props: UserSearchParams): Promise<UserSearchResults> {
    // Determine the sort order
    const sortable = this.sortableFields?.includes(props.sort) || false;
    const orderByField = sortable ? props.sort : 'createdAt';
    const orderByDir = sortable ? props.sortDir : 'desc';

    // Count the number of records that match the search criteria
    const count = await this.prismaService.user.count({
      ...(props.filter && {
        // If a filter is provided, search for users with a name that contains the filter
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    });

    // Retrieve the user models that match the search criteria
    const models = this.prismaService.user.findMany({
      ...(props.filter && {
        // If a filter is provided, search for users with a name that contains the filter
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
        // Sort the results by the specified field in the specified direction
        orderBy: {
          [orderByField]: orderByDir,
        },
        // Skip the first N records
        skip:
          props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
        // Take the next N records
        take: props.perPage && props.perPage > 0 ? props.perPage : 15,
      }),
    });

    // Map the retrieved user models to UserEntities
    const items = (await models).map((model) =>
      UserModelMapper.toEntity(model),
    );

    // Create a SearchResult containing the search results
    return new SearchResult({
      items,
      totalItems: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
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
      data: entity.toJson(), // Convert the user entity to a JSON object for database insertion
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
      data: entity.toJson(),
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
    try {
      // Query the database to find a user by their unique ID
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      // Map the retrieved user model to a UserEntity
      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError('User not found');
    }
  }
}
