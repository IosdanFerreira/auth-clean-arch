import { ConflictError } from '@src/shared/domain/errors/conflict-error';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { SignupValidator } from './validator/signup.validator';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserOutputDto } from '../dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';

export class Signup {
  constructor(
    readonly userRepository: UserRepositoryInterface,
    readonly hashProvider: HashProviderInterface,
  ) {}

  async execute(input: SignupInput): Promise<SignupOutput> {
    const fieldsValidator = new SignupValidator();

    fieldsValidator.validate(input);

    const emailAlreadyExist = await this.userRepository.findByEmail(
      input.email,
    );

    if (emailAlreadyExist) {
      throw new ConflictError(
        'Já existe um usuario cadastrado com esse endereço de email',
      );
    }

    const hashedPassword = await this.hashProvider.generateHash(
      input.password,
      6,
    );

    const user = new UserEntity({
      name: input.name,
      email: input.email,
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
