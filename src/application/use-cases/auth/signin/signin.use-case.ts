import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { CacheTokenRepositoryInterface } from '@src/application/interfaces/cache-token.repository.interface';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { JwtTokenFactoryInterface } from '../../../factories/jwt-token/interfaces/jwt-token.factory.interface';
import { JwtTokenInterface } from '../../../factories/jwt-token/interfaces/jwt-token.interface';
import { UserOutputDto } from '../../user/_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class Signin {
  /**
   * Cria uma instância do caso de uso de login de um usuário
   * @param userRepository Repositório de usuários
   * @param hashProvider Provider de hash de senhas
   * @param jwtTokenFactory Fábrica de tokens JWT
   * @param validator Validador de entrada
   */
  constructor(
    readonly userRepository: UserRepositoryInterface,
    readonly hashProvider: HashProviderInterface,
    private readonly jwtTokenFactory: JwtTokenFactoryInterface,
    private readonly validator: ValidatorInterface<SigninInput>,
    private readonly tokenRepository: CacheTokenRepositoryInterface,
  ) {}

  /**
   * Realiza o login de um usuário com base no email e senha
   * @param input Objeto contendo o email e senha do usuário
   * @returns Uma promessa com o objeto de saída do usuário, contendo os dados, token de acesso e token de refresh
   * @throws Lança um erro se o email ou senha forem inválidos
   */
  async execute(input: SigninInput): Promise<SigninOutput> {
    // Valida o input do usuário
    this.validator.validate(input);

    // Verifica se o usuário existe no repositório
    const userExist = await this.userRepository.findByEmail(input.email);

    // Lança erro se o usuário não for encontrado
    if (!userExist) {
      throw new BadRequestError('Erro ao logar na conta do usuário', [
        { property: 'email', message: 'Email ou senha inválidos' },
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
        { property: 'email', message: 'Email ou senha inválidos' },
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

export type SigninInput = {
  email: string;
  password: string;
};

export type SigninOutput = UserOutputDto & {
  accessToken: JwtTokenInterface;
  refreshToken: JwtTokenInterface;
};
