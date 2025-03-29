import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserOutputDto } from './dto/user-output.dto';
import { UserRepository } from '@src/domain/repositories/user.repository';

export class Signup {
  constructor(
    readonly userRepository: UserRepository,
    readonly hashProvider: HashProviderInterface,
  ) {}

  async execute(input: SignupInput): Promise<SignupOutput> {
    const { name, email, password } = input;

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
