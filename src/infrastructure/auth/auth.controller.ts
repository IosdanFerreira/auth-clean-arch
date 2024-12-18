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

  @Post('signup')
  @HttpCode(201)
  signup(@Body() signupDto: SignupDto) {
    return this.signupUseCase.execute(signupDto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() signinDto: SigninDto) {
    return this.signinUseCase.execute(signinDto);
  }

  @Get()
  search(@Query() searchParams: ListUsersDto) {
    return this.listUsersUseCase.execute(searchParams);
  }

  @Put()
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute({ id, ...updateUserDto });
  }

  @Patch()
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.updatePasswordUseCase.execute({ id, ...updatePasswordDto });
  }

  @Delete()
  deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute({ id });
  }
}
