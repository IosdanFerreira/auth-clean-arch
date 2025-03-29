import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { JwtProviderInterface } from '@src/shared/application/providers/jwt-provider.interface';
import { UserOutputDto } from './dto/user-output.dto';
import { UserRepository } from '@src/domain/repositories/user.repository';

export class Signin {
  constructor(
    readonly userRepository: UserRepository,
    readonly hashProvider: BcryptjsHashProvider,
    private readonly jwtProvider: JwtProviderInterface,
  ) {}

  async execute(input: SigninInput): Promise<SigninOutput> {
    const { email, password } = input;

    const userExist = await this.userRepository.findByEmail(email);

    if (!userExist) {
      throw new BadRequestError('Email ou senha inválidos');
    }

    const hashPasswordMatches = await this.hashProvider.compareHash(
      password,
      userExist.password,
    );

    if (!hashPasswordMatches) {
      throw new BadRequestError('Email ou senha inválidos');
    }

    const token = await this.jwtProvider.generateToken({
      sub: userExist.id,
      email: userExist.email,
    });

    return {
      ...userExist.toJson(),
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
