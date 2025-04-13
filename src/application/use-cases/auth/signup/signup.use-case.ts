import { ConflictError } from '@src/shared/domain/errors/conflict-error';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserOutputDto } from '../../user/_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class Signup {
  /**
   * Caso de uso de cadastro de um novo usuário
   *
   * @param userRepository - Repositório de usuário
   * @param hashProvider - Provider de hash de senha
   * @param validator - Validador de entrada
   */
  constructor(
    readonly userRepository: UserRepositoryInterface,
    readonly hashProvider: HashProviderInterface,
    private readonly validator: ValidatorInterface<SignupInput>,
  ) {}

  /**
   * Executa o cadastro de um novo usuário
   *
   * @param input Dados do usuário a ser cadastrado
   * @returns Uma promessa com o objeto de saída do usuário, contendo os dados
   * @throws Lança um erro se o email já estiver cadastrado
   */
  async execute(input: SignupInput): Promise<SignupOutput> {
    // Valida o input do usuário
    this.validator.validate(input);

    // Verifica se o email do usuário já existe no no banco de dados
    const emailAlreadyExist = await this.userRepository.findByEmail(
      input.email,
    );

    // Lança um erro se o email estiver cadastrado
    if (emailAlreadyExist) {
      throw new ConflictError('Erro ao cadastrar usuário', [
        {
          property: 'email',
          message: 'Já existe um usuário cadastrado com esse endereço de email',
        },
      ]);
    }

    // Gera o hash da senha do usuário
    const hashedPassword = await this.hashProvider.generateHash(
      input.password,
      6,
    );

    // Cria uma instância do objeto User com os dados do usuário
    const user = new UserEntity({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    // Inclui o usuário no repositório
    await this.userRepository.insert(user);

    // Retorna o objeto de saída do usuário
    return user.toJSON();
  }
}

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type SignupOutput = UserOutputDto;
