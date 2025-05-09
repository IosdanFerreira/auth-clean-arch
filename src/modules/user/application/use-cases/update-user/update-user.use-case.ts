import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { NotFoundError } from '@src/shared/domain/errors';
import { UserOutputDto } from '../_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/modules/user/domain/repositories/user.repository';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

export class UpdateUserUseCase {
  /**
   * Caso de uso de atualização de um usuário
   *
   * @param userRepository - Reposit rio de usu rio
   * @param validator - Validador de entrada
   */
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly validator: ValidatorStrategyInterface<UpdateUserInput>,
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
        { property: 'id', message: 'Usuário não encontrado' },
      ]);
    }

    const name = input.name ? Name.create(input.name) : undefined;
    const email = input.email ? Email.create(input.email) : undefined;

    // Atualiza o nome do usuário
    userAlreadyExists.updateUser({
      name,
      email,
    });

    // Atualiza o usuário no banco de dados
    await this.userRepository.update(input.id, userAlreadyExists);

    // Retorna o objeto de saída do usuário atualizado
    return userAlreadyExists.toJSON();
  }
}

export type UpdateUserInput = {
  id: string;
  name?: string;
  email?: string;
};

export type UpdateUserOutput = UserOutputDto;
