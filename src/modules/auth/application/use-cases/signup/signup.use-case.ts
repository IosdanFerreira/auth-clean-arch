import { ConflictError } from '@src/shared/domain/errors';
import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { HashProviderInterface } from '@src/shared/application/interfaces/hash-provider.interface';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { Password } from '@src/shared/domain/value-objects/password/password.value-object';
import { UserEntity } from '@src/modules/user/domain/entity/user.entity';
import { UserOutputDto } from '@src/modules/user/application/use-cases/_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/modules/user/domain/repositories/user.repository';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

export class SignUpUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashProvider: HashProviderInterface,
    private readonly validator: ValidatorStrategyInterface<SignupInput>,
  ) {}

  /**
   * Signs up a new user.
   *
   * @throws {Error} - If any of the params are missing
   * @throws {Error} - If the email already exists
   *
   * @param {SignupInput} input - The input data for the user
   * @returns {Promise<SignupOutput>} - The created user
   */
  async execute(input: SignupInput): Promise<SignupOutput> {
    // Valida o input do usuário
    this.validator.validate(input);

    // Verifica se o email do usuário já existe no no banco de dados
    const emailAlreadyExist = await this.userRepository.findByEmail(
      input.email,
    );

    if (emailAlreadyExist) {
      throw new ConflictError('Erro ao cadastrar novo usuário', [
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
    const user = UserEntity.create({
      name: Name.create(input.name),
      email: Email.create(input.email),
      password: Password.create(hashedPassword),
    });

    // Inclui o usuário no banco de dados
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
