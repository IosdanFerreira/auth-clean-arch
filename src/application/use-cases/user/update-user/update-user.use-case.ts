import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserOutputDto } from '../_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class UpdateUser {
  /**
   * Caso de uso de atualização de um usuário
   *
   * @param userRepository - Reposit rio de usu rio
   * @param validator - Validador de entrada
   */
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly validator: ValidatorInterface<UpdateUserInput>,
  ) {}

  /**
   * Executa a atualização de um usuário
   *
   * @param input - Dados do usuário a ser atualizado
   * @returns Uma promessa com o objeto de saída do usuário atualizado
   * @throws Lança um erro se o usuário não for encontrado
   */
  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    // Valida o input do usuário
    this.validator.validate(input);

    // Verifica se o usuário já existe no banco de dados
    const userAlreadyExists = await this.userRepository.findByID(input.id);

    // Lança um erro se o usuário não for encontrado
    if (!userAlreadyExists) {
      throw new NotFoundError('Erro ao atualizar usuário', [
        { property: 'id', message: 'Usuário nao encontrado' },
      ]);
    }

    // Atualiza o nome do usuário
    userAlreadyExists.update(input.name);

    // Atualiza o usuário no banco de dados
    await this.userRepository.update(input.id, userAlreadyExists);

    // Retorna o objeto de saída do usuário atualizado
    return userAlreadyExists.toJSON();
  }
}

export type UpdateUserInput = {
  id: string;
  name: string;
};

export type UpdateUserOutput = UserOutputDto;
