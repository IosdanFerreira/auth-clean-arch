import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';

export class DeleteUser {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    if (!input.id) {
      throw new BadRequestError('Erro ao deletar usuário', [
        { property: 'id', message: 'ID do usuário precisa ser informado' },
      ]);
    }

    const userAlreadyExists = await this.userRepository.findByID(input.id);

    if (!userAlreadyExists) {
      throw new NotFoundError('Erro ao excluir usuário', [
        { property: 'id', message: 'Usuário não encontrado' },
      ]);
    }

    await this.userRepository.delete(input.id);
  }
}

export type DeleteUserInput = {
  id: string;
};

export type DeleteUserOutput = void;
