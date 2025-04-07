import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserOutputDto } from '../_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class UpdateUser {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly validator: ValidatorInterface<UpdateUserInput>,
  ) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    this.validator.validate(input);

    const userAlreadyExists = await this.userRepository.findByID(input.id);

    if (!userAlreadyExists) {
      throw new NotFoundError('Erro ao atualizar usuário', [
        { property: 'id', message: 'Usuário nao encontrado' },
      ]);
    }

    userAlreadyExists.update(input.name);

    await this.userRepository.update(input.id, userAlreadyExists);

    return userAlreadyExists.toJSON();
  }
}

export type UpdateUserInput = {
  id: string;
  name: string;
};

export type UpdateUserOutput = UserOutputDto;
