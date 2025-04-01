import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { UserOutputDto } from './dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';

export class GetUserByEmail {
  constructor(readonly userRepository: UserRepositoryInterface) {}

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
