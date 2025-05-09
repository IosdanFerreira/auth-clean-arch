import { RepositoryContractInterface } from '@src/shared/domain/interfaces';
import { UserEntity } from '../entity/user.entity';

export interface UserRepositoryInterface
  extends Omit<RepositoryContractInterface<UserEntity>, 'findAll'> {
  findByEmail(email: string): Promise<UserEntity>;
}
