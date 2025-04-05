import { UserEntity } from '@src/domain/entities/user/user.entity';

export interface UserOutputDto {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export class UserOutputMapper {
  static toOutput(entity: UserEntity): UserOutputDto {
    return entity.toJSON();
  }
}
