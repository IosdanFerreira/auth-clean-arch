import { UserOutputDto, UserOutputMapper } from '../dto/user-output.dto';

import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UpdateUserValidator } from './validator/update-user.validator';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';

export class UpdateUser {
  constructor(readonly userRepository: UserRepositoryInterface) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const fieldsValidation = new UpdateUserValidator();

    fieldsValidation.validate(input);

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
