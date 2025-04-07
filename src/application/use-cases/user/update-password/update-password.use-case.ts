import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserOutputDto } from '../_dto/user-output.dto';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class UpdatePassword {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashProvider: HashProviderInterface,
    private readonly validator: ValidatorInterface<UpdatePasswordInput>,
  ) {}

  async execute(input: UpdatePasswordInput): Promise<UpdatePasswordOutput> {
    this.validator.validate(input);

    const userExist = await this.userRepository.findByID(input.id);

    if (!userExist) {
      throw new NotFoundError('Erro ao atualizar senha', [
        { property: 'id', message: 'Usuário nao encontrado' },
      ]);
    }

    const checkOldPassword = await this.hashProvider.compareHash(
      input.oldPassword,
      userExist.password,
    );

    if (!checkOldPassword) {
      throw new BadRequestError('Erro ao atualizar senha', [
        { property: 'password', message: 'Senha inválida' },
      ]);
    }

    const newHashPassword = await this.hashProvider.generateHash(
      input.password,
      6,
    );

    userExist.updatePassword(newHashPassword);

    await this.userRepository.update(input.id, userExist);

    return userExist.toJSON();
  }
}

export type UpdatePasswordInput = {
  id: string;
  oldPassword: string;
  password: string;
};

export type UpdatePasswordOutput = UserOutputDto;
