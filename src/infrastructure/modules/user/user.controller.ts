import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  Get,
  Query,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { Signup } from '@src/application/use-cases/user/signup/signup.use-case';
import { Signin } from '@src/application/use-cases/user/signin/signin.use-case';
import { DeleteUser } from '@src/application/use-cases/user/delete-user/delete-user.use-case';
import { GetUserByEmail } from '@src/application/use-cases/user/get-user-by-email/get-user-by-email.use-case';
import { SigninDto } from './dto/signin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserOutputDto } from '@src/application/use-cases/user/dto/user-output.dto';
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presenters/user.presenter';
import { isPublic } from '@src/shared/infrastructure/decorators/is-public.decorator';
import { UpdateUser } from '@src/application/use-cases/user/update-user/update-user.use-case';
import { UpdatePassword } from '@src/application/use-cases/user/update-password/update-password.use-case';
import { ListUsers } from '@src/application/use-cases/user/list-user/list-users.use-case';

@Controller('users')
export class UserController {
  @Inject(Signup)
  private signupUseCase: Signup;

  @Inject(Signin)
  private signinUseCase: Signin;

  @Inject(UpdateUser)
  private updateUserUseCase: UpdateUser;

  @Inject(UpdatePassword)
  private updatePasswordUseCase: UpdatePassword;

  @Inject(DeleteUser)
  private deleteUserUseCase: DeleteUser;

  @Inject(GetUserByEmail)
  private getUserByEmailUseCase: GetUserByEmail;

  @Inject(ListUsers)
  private listUsersUseCase: ListUsers;

  static UserToResponse(output: UserOutputDto) {
    return new UserPresenter(output);
  }

  @isPublic()
  @Post('signup')
  @HttpCode(201)
  async signup(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);

    return UserController.UserToResponse(output);
  }

  @isPublic()
  @Post('login')
  @HttpCode(200)
  async login(@Body() signinDto: SigninDto) {
    const output = await this.signinUseCase.execute(signinDto);

    return {
      ...UserController.UserToResponse(output),
      accessToken: output.accessToken,
    };
  }

  @Get()
  async search(@Query() searchParams: any) {
    const output = await this.listUsersUseCase.execute(searchParams);

    return UserCollectionPresenter.present(
      output.items,
      output.meta,
      'Lista de usuários encontrada',
    );
  }

  @Put()
  async updateUser(
    @Query('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });

    return UserController.UserToResponse(output);
  }

  @Patch('update-password')
  async updatePassword(
    @Query('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    });

    return UserController.UserToResponse(output);
  }

  @Delete()
  deleteUser(@Query('id') id: string) {
    return this.deleteUserUseCase.execute({ id });
  }
}
