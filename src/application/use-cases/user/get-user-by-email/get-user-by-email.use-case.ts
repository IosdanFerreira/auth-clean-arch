import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserOutputDto } from '../_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class GetUserByEmail {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly validator: ValidatorInterface<GetUserByEmailInput>,
  ) {}

  async execute(email: string): Promise<GetUserByEmailOutput> {
    this.validator.validate({ email });

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError('Erro ao encontrar usuário', [
        { property: 'email', message: 'Usuário nao encontrado' },
      ]);
    }

    return user.toJSON();
  }
}

export type GetUserByEmailInput = {
  email: string;
};

export type GetUserByEmailOutput = UserOutputDto;
