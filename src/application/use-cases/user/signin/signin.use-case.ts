import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { JwtProviderInterface } from '@src/shared/application/providers/jwt-provider.interface';
import { UserOutputDto } from '../_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class Signin {
  constructor(
    readonly userRepository: UserRepositoryInterface,
    readonly hashProvider: HashProviderInterface,
    private readonly jwtProvider: JwtProviderInterface,
    private readonly validator: ValidatorInterface<SigninInput>,
  ) {}

  async execute(input: SigninInput): Promise<SigninOutput> {
    this.validator.validate(input);

    const userExist = await this.userRepository.findByEmail(input.email);

    if (!userExist) {
      throw new BadRequestError('Erro ao logar na conta do usuário', [
        { property: 'email', message: 'Email ou senha inválidos' },
      ]);
    }

    const hashPasswordMatches = await this.hashProvider.compareHash(
      input.password,
      userExist.password,
    );

    if (!hashPasswordMatches) {
      throw new BadRequestError('Erro ao logar na conta do usuário', [
        { property: 'email', message: 'Email ou senha inválidos' },
      ]);
    }

    const token = await this.jwtProvider.generateToken({
      sub: userExist.id,
      email: userExist.email,
    });

    return {
      ...userExist.toJSON(),
      accessToken: token,
    };
  }
}

export type SigninInput = {
  email: string;
  password: string;
};

export type SigninOutput = UserOutputDto & {
  accessToken: string;
};
