import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserRepository } from '@src/domain/repositories/user.repository';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { UserOutputDto } from './dto/user-output.dto';

export class Signup {
  constructor(
    readonly userRepository: UserRepository,
    readonly hashProvider: BcryptjsHashProvider,
  ) {}

  async execute(input: SignupInput): Promise<SignupOutput> {
    const { name, email, password } = input;

    if (!name || !email || !password) {
      throw new BadRequestError('Params not provider');
    }

    await this.userRepository.emailExist(email);

    const hashedPassword = await this.hashProvider.generateHash(password, 6);

    const user = new UserEntity({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.insert(user);

    return user.toJson();
  }
}

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type SignupOutput = UserOutputDto;
