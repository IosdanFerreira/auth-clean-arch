import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { JwtProviderInterface } from '@src/shared/application/providers/jwt-provider.interface';
import { SigninValidator } from './validator/signin.validator';
import { UserOutputDto } from '../dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';

export class Signin {
  constructor(
    readonly userRepository: UserRepositoryInterface,
    readonly hashProvider: BcryptjsHashProvider,
    private readonly jwtProvider: JwtProviderInterface,
  ) {}

  async execute(input: SigninInput): Promise<SigninOutput> {
    const fieldsValidation = new SigninValidator();

    fieldsValidation.validate(input);

    const userExist = await this.userRepository.findByEmail(input.email);

    if (!userExist) {
      throw new BadRequestError([
        { property: 'email', message: 'Email ou senha inválidos' },
      ]);
    }

    const hashPasswordMatches = await this.hashProvider.compareHash(
      input.password,
      userExist.password,
    );

    if (!hashPasswordMatches) {
      throw new BadRequestError([
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
