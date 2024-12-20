import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  Get,
  Query,
  Put,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { Signup } from '@src/application/use-cases/auth/signup.use-case';
import { Signin } from '@src/application/use-cases/auth/signin.use-case';
import { UpdateUser } from '@src/application/use-cases/auth/update-user.use-case';
import { UpdatePassword } from '@src/application/use-cases/auth/update-password.use-case';
import { DeleteUser } from '@src/application/use-cases/auth/delete-user.use-case';
import { GetUserByEmail } from '@src/application/use-cases/auth/get-user-by-email.use-case';
import { ListUsers } from '@src/application/use-cases/auth/list-users.use-case';
import { SigninDto } from './dto/signin.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserOutputDto } from '@src/application/use-cases/auth/dto/user-output.dto';
import { AuthPresenter } from './presenters/auth.presenter';

@Controller('users')
export class AuthController {
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

  static AuthToResponse(output: UserOutputDto) {
    return new AuthPresenter(output);
  }

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);

    return AuthController.AuthToResponse(output);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() signinDto: SigninDto) {
    const output = await this.signinUseCase.execute(signinDto);

    return AuthController.AuthToResponse(output);
  }

  @Get()
  search(@Query() searchParams: ListUsersDto) {
    return this.listUsersUseCase.execute(searchParams);
  }

  @Put()
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });

    return AuthController.AuthToResponse(output);
  }

  @Patch()
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    });

    return AuthController.AuthToResponse(output);
  }

  @Delete()
  deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute({ id });
  }
}
