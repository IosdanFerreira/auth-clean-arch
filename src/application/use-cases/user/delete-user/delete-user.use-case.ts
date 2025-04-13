import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';

export class DeleteUser {
  constructor(private userRepository: UserRepositoryInterface) {}

  /**
   * Executa a exclusão de um usuário
   *
   * @param input - Dados do usuário a ser excluído
   * @returns Uma promessa com o objeto de sa da do usuário excluído
   * @throws Lança um erro se o ID do usuário não for informado
   * @throws Lança um erro se o usuário não for encontrado
   */
  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    // Verifica se o ID do usuário foi informado
    if (!input.id) {
      throw new BadRequestError('Erro ao deletar usuário', [
        { property: 'id', message: 'ID do usuário precisa ser informado' },
      ]);
    }

    // Verifica se o usuário existe no banco de dados
    const userAlreadyExists = await this.userRepository.findByID(input.id);

    // Lança um erro se o usuário não for encontrado
    if (!userAlreadyExists) {
      throw new NotFoundError('Erro ao excluir usuário', [
        { property: 'id', message: 'Usuário não encontrado' },
      ]);
    }

    // Exclui o usuário do banco de dados
    await this.userRepository.delete(input.id);
  }
}

export type DeleteUserInput = {
  id: string;
};

export type DeleteUserOutput = void;
