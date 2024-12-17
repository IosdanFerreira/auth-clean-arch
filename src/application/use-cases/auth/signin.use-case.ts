// import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserRepository } from '@src/domain/repositories/user.repository';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { UserOutputDto } from './dto/user-output.dto';

export class Signin {
  constructor(
    readonly userRepository: UserRepository,
    readonly hashProvider: BcryptjsHashProvider,
  ) {}

  async execute(input: SignupInput): Promise<any> {
    const { email, password } = input;

    if (!email || !password) {
      throw new BadRequestError('Params not provided');
    }

    const userExist = await this.userRepository.findByEmail(email);

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

export type SignupInput = {
  email: string;
  password: string;
};

export type SignupOutput = UserOutputDto;
