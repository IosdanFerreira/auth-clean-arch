import {
  UserRepository,
  UserSearchParams,
  UserSearchResults,
} from '@src/domain/repositories/user.repository';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { PrismaService } from '@src/shared/infrastructure/database/prisma/prisma.service';
import { UserModelMapper } from '../models/user-model.mapper';

export class AuthRepositoryDatabase implements UserRepository {
  sortableFields: string[];

  constructor(private readonly prismaService: PrismaService) {}

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  emailExist(email: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  search(props: UserSearchParams): Promise<UserSearchResults> {
    throw new Error('Method not implemented.');
  }

  insert(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }

  findByID(id: string): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  update(id: string, entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
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
    } catch (error: any) {
      // Throw an error if the operation fails
      throw new Error(error);
    }
  }
}
