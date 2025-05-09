import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { EntityCreationError } from '@src/shared/domain/errors';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { Password } from '@src/shared/domain/value-objects/password/password.value-object';
import { User } from '@prisma/client';
import { UserEntity } from '@src/modules/user/domain/entity/user.entity';

export class UserModelMapper {
  /**
   * Converte um modelo de Usuário do banco de dados para uma entidade de domínio.
   *
   * @param model - O modelo de Usu rio do banco de dados.
   * @returns Uma instância de {@link UserEntity}.
   * @throws {Error} Caso o modelo seja inv lido.
   */
  static toEntity(model: User): UserEntity {
    const data = {
      name: Name.create(model.name),
      email: Email.create(model.email),
      password: Password.create(model.password),
      createdAt: model.createdAt,
    };

    try {
      // Tenta criar uma entidade de Usuário com os dados do modelo
      return UserEntity.create({ ...data }, model.id);
    } catch {
      // Caso não seja possível criar a entidade, lança um erro
      throw new EntityCreationError('Entidade não pôde ser criada', [
        {
          property: 'UserModelMapper',
          message: 'Erro ao criar entidade de Usuário',
        },
      ]);
    }
  }
}
