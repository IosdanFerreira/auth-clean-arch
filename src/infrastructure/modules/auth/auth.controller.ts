import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Signup } from '@src/application/use-cases/user/signup/signup.use-case';
import { Signin } from '@src/application/use-cases/user/signin/signin.use-case';

import { isPublic } from '@src/shared/infrastructure/decorators/is-public.decorator';
import { SignupDto } from '../user/dto/signup.dto';
import { SigninDto } from '../user/dto/signin.dto';
import { UserPresenter } from '../user/presenters/user.presenter';

@Controller('auth')
export class AuthController {
  @Inject(Signup)
  private signupUseCase: Signup;

  @Inject(Signin)
  private signinUseCase: Signin;

  @isPublic()
  @Post('signup')
  @HttpCode(201)
  async signup(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);

    return UserPresenter.present(
      output,
      HttpStatus.CREATED,
      'Novo usuário cadastrado',
    );
  }

  @isPublic()
  @Post('login')
  @HttpCode(200)
  async login(@Body() signinDto: SigninDto) {
    const output = await this.signinUseCase.execute(signinDto);

    return UserPresenter.present(output, HttpStatus.OK, 'Usuário logado');
  }
}
