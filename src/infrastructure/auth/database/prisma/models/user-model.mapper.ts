import { User } from '@prisma/client';
import { UserEntity } from '@src/domain/entities/user/user.entity';

export class UserModelMapper {
  static toEntity(model: User) {
    const data = {
      name: model.name,
      email: model.email,
      password: model.password,
      createdAt: model.createdAt,
    };

    try {
      return new UserEntity(data, model.id);
    } catch {
      throw new Error('An entity not be loaded');
    }
  }
}
