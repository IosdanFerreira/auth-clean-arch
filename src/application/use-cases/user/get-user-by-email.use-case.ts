import { UserRepository } from '@src/domain/repositories/user.repository';
import { UserOutputDto } from './dto/user-output.dto';
import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';

export class GetUserByEmail {
  constructor(readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<GetUserByEmailOutput> {
    if (!email) {
      throw new BadRequestError('Email not provided');
    }

    const user = await this.userRepository.findByEmail(email);

    return user.toJson();
  }
}

export type GetUserByEmailInput = {
  email: string;
};

export type GetUserByEmailOutput = UserOutputDto;
