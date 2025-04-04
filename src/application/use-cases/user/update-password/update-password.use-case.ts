import { UserOutputDto, UserOutputMapper } from '../dto/user-output.dto';

import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UpdatePasswordValidator } from './validator/update-password.validator';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';

export class UpdatePassword {
  constructor(
    private userRepository: UserRepositoryInterface,
    private hashProvider: HashProviderInterface,
  ) {}

  async execute(input: UpdatePasswordInput): Promise<UpdatePasswordOutput> {
    const validator = new UpdatePasswordValidator();

    validator.validate(input);

    const userExist = await this.userRepository.findByID(input.id);

    if (!userExist) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const checkOldPassword = await this.hashProvider.compareHash(
      input.oldPassword,
      userExist.password,
    );

    if (!checkOldPassword) {
      throw new BadRequestError([
        { property: 'password', message: 'Senha inválida' },
      ]);
    }

    const newHashPassword = await this.hashProvider.generateHash(
      input.password,
      6,
    );

    userExist.updatePassword(newHashPassword);

    await this.userRepository.update(input.id, userExist);

    return UserOutputMapper.toOutput(userExist);
  }
}

export type UpdatePasswordInput = {
  id: string;
  oldPassword: string;
  password: string;
};

export type UpdatePasswordOutput = UserOutputDto;
