import { AuthController } from '../../auth.controller';
import { UserOutputDto } from '@src/application/use-cases/auth/dto/user-output.dto';
import { SignupDto } from '../../dto/signup.dto';
import { SignupOutput } from '@src/application/use-cases/auth/signup.use-case';
import { SigninDto } from '../../dto/signin.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UpdateUserOutput } from '@src/application/use-cases/auth/update-user.use-case';
import { UpdatePasswordDto } from '../../dto/update-password.dto';
import { updatePasswordOutput } from '@src/application/use-cases/auth/update-password.use-case';
import { ListUsersOutput } from '@src/application/use-cases/auth/list-users.use-case';
import { SearchInput } from '@src/shared/application/dtos/search-input.dto';

describe('AuthController unit tests', () => {
  let sut: AuthController;
  let id: string;
  let props: UserOutputDto;

  beforeEach(async () => {
    sut = new AuthController();

    id = 'df96ae94-6128-486e-840c-b6f78abb4801';

    props = {
      id,
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '12345678',
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create user', async () => {
    const input: SignupDto = {
      name: 'test',
      email: 'test@gmail.com',
      password: '12345678',
    };

    const output: SignupOutput = props;

    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['signupUseCase'] = mockSignupUseCase as any;

    const result = await sut.signup(input);

    expect(result).toMatchObject(output);
    expect(mockSignupUseCase.execute).toHaveBeenCalled();
  });

  it('should login user', async () => {
    const input: SigninDto = {
      email: 'test@gmail.com',
      password: '12345678',
    };

    const output: SignupOutput = props;

    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['signinUseCase'] = mockSigninUseCase as any;

    const result = await sut.login(input);

    expect(result).toMatchObject(output);
    expect(mockSigninUseCase.execute).toHaveBeenCalled();
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should update user', async () => {
    const input: UpdateUserDto = {
      name: 'new test',
    };

    const output: UpdateUserOutput = props;

    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['updateUserUseCase'] = mockUpdateUserUseCase as any;

    const result = await sut.updateUser(id, input);

    expect(result).toMatchObject(output);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalled();
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });

  it('should update password', async () => {
    const input: UpdatePasswordDto = {
      oldPassword: '12345678',
      password: 'new-password',
    };

    const output: updatePasswordOutput = props;

    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any;

    const result = await sut.updatePassword(id, input);

    expect(result).toMatchObject(output);
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalled();
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });

  it('should delete a user', async () => {
    const output = undefined;

    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any;

    const result = await sut.deleteUser(id);

    expect(output).toStrictEqual(result);
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({
      id,
    });
  });

  it('should list users', async () => {
    const output: ListUsersOutput = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      totalItems: 1,
    };

    const mockListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['listUsersUseCase'] = mockListUsersUseCase as any;

    const searchParams: SearchInput = {
      page: 1,
      perPage: 1,
      sort: 'createdAt',
      sortDir: 'desc',
    };

    const result = await sut.search(searchParams);
    expect(output).toStrictEqual(result);
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(searchParams);
  });
});
