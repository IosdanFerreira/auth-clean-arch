import { JwtTokenFactoryInterface, JwtTokenInterface } from '../../interfaces';

import { BadRequestError } from '@src/shared/domain/errors/bad-request.error';
import { CacheTokenInterface } from '../../interfaces/cache-token.interface';
import { HashProviderInterface } from '@src/shared/application/interfaces/hash-provider.interface';
import { UserOutputDto } from '../../../../user/application/use-cases/_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/modules/user/domain/repositories/user.repository';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

export class SignInUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashProvider: HashProviderInterface,
    private readonly jwtTokenFactory: JwtTokenFactoryInterface,
    private readonly validator: ValidatorStrategyInterface<SignInInput>,
    private readonly tokenRepository: CacheTokenInterface,
  ) {}

  /**
   * Executes the sign-in process for a user.
   *
   * @param {SignInInput} input - The input data containing email and password.
   * @returns {Promise<SignInOutput>} - The signed-in user's data.
   * @throws {BadRequestError} - If email or password is missing or invalid.
   */
  async execute(input: SignInInput): Promise<SignInOutput> {
    // Valida o input do usuário
    this.validator.validate(input);

    // Verifica se o usuário existe no repositório
    const userExist = await this.userRepository.findByEmail(input.email);

    // Lança erro se o usuário não for encontrado
    if (!userExist) {
      throw new BadRequestError('Erro ao logar na conta do usuário', [
        { property: 'email/password', message: 'Email ou senha inválidos' },
      ]);
    }

    // Compara a senha fornecida com a senha armazenada
    const hashPasswordMatches = await this.hashProvider.compareHash(
      input.password,
      userExist.password,
    );

    // Lança erro se as senhas não corresponderem
    if (!hashPasswordMatches) {
      throw new BadRequestError('Erro ao logar na conta do usuário', [
        { property: 'email/password', message: 'Email ou senha inválidos' },
      ]);
    }

    // Gera o token de acesso para o usuário
    const accessToken = await this.jwtTokenFactory.generateAccessToken(
      userExist.id,
      userExist.email,
    );

    // Gera o token de refresh para o usuário
    const refreshToken = await this.jwtTokenFactory.generateRefreshToken(
      userExist.id,
      userExist.email,
    );

    await this.tokenRepository.saveRefreshToken(
      userExist.id,
      refreshToken.token,
      refreshToken.expiresIn,
    );

    // Retorna os dados do usuário juntamente com os tokens gerados
    return {
      ...userExist.toJSON(),
      accessToken,
      refreshToken,
    };
  }
}

export type SignInInput = {
  email: string;
  password: string;
};

export type SignInOutput = UserOutputDto & {
  accessToken: JwtTokenInterface;
  refreshToken: JwtTokenInterface;
};
