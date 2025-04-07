import { ConflictError } from '@src/shared/domain/errors/conflict-error';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserOutputDto } from '../_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class Signup {
  constructor(
    readonly userRepository: UserRepositoryInterface,
    readonly hashProvider: HashProviderInterface,
    private readonly validator: ValidatorInterface<SignupInput>,
  ) {}

  async execute(input: SignupInput): Promise<SignupOutput> {
    this.validator.validate(input);

    const emailAlreadyExist = await this.userRepository.findByEmail(
      input.email,
    );

    if (emailAlreadyExist) {
      throw new ConflictError('Erro ao cadastrar usuário', [
        {
          property: 'email',
          message: 'Já existe um usuario cadastrado com esse endereço de email',
        },
      ]);
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

    return user.toJSON();
  }
}

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type SignupOutput = UserOutputDto;
