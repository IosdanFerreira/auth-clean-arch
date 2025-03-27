import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserOutputDto } from './dto/user-output.dto';
import { UserRepository } from '@src/domain/repositories/user.repository';

export class Signin {
  constructor(
    readonly userRepository: UserRepository,
    readonly hashProvider: BcryptjsHashProvider,
  ) {}

  async execute(input: SigninInput): Promise<SigninOutput> {
    const { email, password } = input;

    if (!email || !password) {
      throw new BadRequestError('Params not provided');
    }

    const userExist = await this.userRepository.findByEmail(email);

    if (!userExist) {
      throw new BadRequestError('Email ou senha inválidos');
    }

    const hashPasswordMatches = await this.hashProvider.compareHash(
      password,
      userExist.password,
    );

    if (!hashPasswordMatches) {
      throw new Error('Invalid credentials');
    }

    return userExist.toJson();
  }
}

export type SigninInput = {
  email: string;
  password: string;
};

export type SigninOutput = UserOutputDto;
