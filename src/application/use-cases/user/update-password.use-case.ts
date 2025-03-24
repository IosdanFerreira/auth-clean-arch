import { UserRepository } from '@src/domain/repositories/user.repository';
import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { UserOutputDto, UserOutputMapper } from './dto/user-output.dto';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider';

export class UpdatePassword {
  constructor(
    private userRepository: UserRepository,
    private hashProvider: HashProviderInterface,
  ) {}

  async execute(input: updatePasswordInput): Promise<updatePasswordOutput> {
    const userExist = await this.userRepository.findByID(input.id);

    if (!input.oldPassword || !input.password) {
      throw new BadRequestError('Old password and new password is required');
    }

    const checkOldPassword = await this.hashProvider.compareHash(
      input.oldPassword,
      userExist.password,
    );

    if (!checkOldPassword) {
      throw new Error('Invalid old password');
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

export type updatePasswordInput = {
  id: string;
  password: string;
  oldPassword: string;
};

export type updatePasswordOutput = UserOutputDto;
