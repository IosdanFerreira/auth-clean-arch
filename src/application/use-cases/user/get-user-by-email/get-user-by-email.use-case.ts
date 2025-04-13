import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserOutputDto } from '../_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class GetUserByEmail {
  /**
   * Caso de uso de pegar um usuário por email
   *
   * @param userRepository - Repositório de usuários
   * @param validator - Validador de entrada para o email
   */
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly validator: ValidatorInterface<GetUserByEmailInput>,
  ) {}

  /**
   * Executa o caso de uso de pegar um usuário por email
   * @param email - Email do usuário a ser encontrado
   * @returns Uma promessa com o objeto de saída do usuário, contendo os dados do usuário
   * @throws {NotFoundError} Se o usuário não for encontrado
   */
  async execute(email: string): Promise<GetUserByEmailOutput> {
    // Valida o input do usuário
    this.validator.validate({ email });

    // Verifica se o usuário existe no repositório
    const user = await this.userRepository.findByEmail(email);

    // Lança um erro se o usuário não for encontrado
    if (!user) {
      throw new NotFoundError('Erro ao encontrar usuário', [
        { property: 'email', message: 'Usuário nao encontrado' },
      ]);
    }

    // Retorna o objeto de saída do usuário
    return user.toJSON();
  }
}

export type GetUserByEmailInput = {
  email: string;
};

export type GetUserByEmailOutput = UserOutputDto;
