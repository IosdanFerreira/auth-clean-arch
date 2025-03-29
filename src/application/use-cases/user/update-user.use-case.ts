import { UserOutputDto, UserOutputMapper } from './dto/user-output.dto';

import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserRepository } from '@src/domain/repositories/user.repository';

export class UpdateUser {
  constructor(readonly userRepository: UserRepository) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    if (!input.id) {
      throw new BadRequestError('ID do usuário precisa ser informado');
    }

    const userAlreadyExists = await this.userRepository.findByID(input.id);

    if (!userAlreadyExists) {
      throw new NotFoundError(
        'Nenhum usuário com o ID informado foi encontrado',
      );
    }

    userAlreadyExists.update(input.name);

    await this.userRepository.update(input.id, userAlreadyExists);

    return UserOutputMapper.toOutput(userAlreadyExists);
  }
}

export type UpdateUserInput = {
  id: string;
  name: string;
};

export type UpdateUserOutput = UserOutputDto;
