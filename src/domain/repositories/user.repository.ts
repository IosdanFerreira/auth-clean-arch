import { UserEntity } from '../entities/user/user.entity';
import { SearchableRepositoryInterface } from '@src/shared/domain/repositories/searchable-repository-contract';

export interface UserRepository
  extends SearchableRepositoryInterface<UserEntity, any, any> {
  findByEmail(email: string): Promise<UserEntity>;
  emailExist(email: string): Promise<void>;
}
