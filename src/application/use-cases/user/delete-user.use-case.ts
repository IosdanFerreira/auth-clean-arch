import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserRepository } from '@src/domain/repositories/user.repository';

export class DeleteUser {
  constructor(private userRepository: UserRepository) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    if (!input.id) {
      throw new BadRequestError('ID do usuário precisa ser informado');
    }

    const userAlreadyExists = await this.userRepository.findByID(input.id);

    if (!userAlreadyExists) {
      throw new NotFoundError(
        'Nenhum usuário com o ID informado foi encontrado',
      );
    }

    await this.userRepository.delete(input.id);
  }
}

export type DeleteUserInput = {
  id: string;
};

export type DeleteUserOutput = void;
