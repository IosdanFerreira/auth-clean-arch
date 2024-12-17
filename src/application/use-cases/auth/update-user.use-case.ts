import { UserRepository } from '@src/domain/repositories/user.repository';
import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { UserOutputDto, UserOutputMapper } from './dto/user-output.dto';

export class UpdateUser {
  constructor(readonly userRepository: UserRepository) {}

  async execute(input: SignupInput): Promise<SignupOutput> {
    const user = await this.userRepository.findByID(input.id);

    if (!input.name) {
      throw new BadRequestError('Name not provided');
    }

    user.update(input.name);

    await this.userRepository.update(input.id, user);

    return UserOutputMapper.toOutput(user);
  }
}

export type SignupInput = {
  id: string;
  name: string;
};

export type SignupOutput = UserOutputDto;
