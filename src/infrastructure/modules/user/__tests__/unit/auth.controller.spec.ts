import { ListUsersDto } from '../../dto/list-users.dto';
import { ListUsersOutput } from '@src/application/use-cases/user/list-users.use-case';
import { SigninDto } from '../../dto/signin.dto';
import { SignupDto } from '../../dto/signup.dto';
import { SignupOutput } from '@src/application/use-cases/user/signup/signup.use-case';
import { UpdatePasswordDto } from '../../dto/update-password.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UpdateUserOutput } from '@src/application/use-cases/user/update-user.use-case';
import { UserController } from '../../user.controller';
import { UserOutputDto } from '@src/application/use-cases/user/dto/user-output.dto';
import { UserPresenter } from '../../presenters/user.presenter';
import { updatePasswordOutput } from '@src/application/use-cases/user/update-password.use-case';

describe('UsersController unit tests', () => {
  let sut: UserController;
  let id: string;
  let props: UserOutputDto;

  beforeEach(async () => {
    sut = new UserController();
    id = 'df96ae94-6128-486e-840c-b6f78abb4801';
    props = {
      id,
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
      createdAt: new Date(),
    };
  });

  it('should create a user', async () => {
    const output: SignupOutput = props;

    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['signupUseCase'] = mockSignupUseCase as any;

    const input: SignupDto = {
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
    };

    const presenter = await sut.signup(input);

    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(output));
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should authenticate a user', async () => {
    const output = {
      createdAt: new Date(),
      email: 'john@a.com',
      id: '7bd93b33-9a82-4a1e-a3aa-3ed23dc32079',
      name: 'John Doe',
    };

    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    const mockAuthService = {
      generateJwt: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['signinUseCase'] = mockSigninUseCase as any;

    sut['authService'] = mockAuthService as any;

    const input: SigninDto = {
      email: 'a@a.com',
      password: '1234',
    };

    const result = await sut.login(input);

    expect(result).toEqual(output);
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should update a user', async () => {
    const output: UpdateUserOutput = props;

    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['updateUserUseCase'] = mockUpdateUserUseCase as any;
    const input: UpdateUserDto = {
      name: 'new name',
    };

    const presenter = await sut.updateUser(id, input);

    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(output));
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });

  it('should update a users password', async () => {
    const output: updatePasswordOutput = props;

    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any;

    const input: UpdatePasswordDto = {
      password: 'new password',
      oldPassword: 'old password',
    };

    const presenter = await sut.updatePassword(id, input);

    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(output));
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

    const searchParams: ListUsersDto = {
      page: 0,
      perPage: 0,
      sort: '',
      sortDir: 'asc',
    };

    const presenter = await sut.search(searchParams);

    expect(presenter).toEqual({
      items: output.items,
      currentPage: output.currentPage,
      lastPage: output.lastPage,
      perPage: output.perPage,
      totalItems: output.totalItems,
    });
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(searchParams);
  });
});
