import { GetUserByEmailValidator } from './validator/get-user-by-email.validator';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserOutputDto } from '../dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';

export class GetUserByEmail {
  constructor(readonly userRepository: UserRepositoryInterface) {}

  async execute(email: string): Promise<GetUserByEmailOutput> {
    const fieldsValidation = new GetUserByEmailValidator();

    fieldsValidation.validate({ email });

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return user.toJSON();
  }
}

export type GetUserByEmailInput = {
  email: string;
};

export type GetUserByEmailOutput = UserOutputDto;
