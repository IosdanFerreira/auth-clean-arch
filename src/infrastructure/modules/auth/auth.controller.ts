import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Signin } from '@src/application/use-cases/auth/signin/signin.use-case';

import { isPublic } from '@src/shared/infrastructure/decorators/is-public.decorator';
import { SignupDto } from '../user/dto/signup.dto';
import { SigninDto } from '../user/dto/signin.dto';
import { UserPresenter } from '../user/presenters/user.presenter';
import { Signup } from '@src/application/use-cases/auth/signup/signup.use-case';
import { RefreshTokenUseCase } from '@src/application/use-cases/auth/refresh-token/refresh-token.use-case';
import { RefreshJwtAuthGuard } from '@src/shared/infrastructure/guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  @Inject(Signup)
  private signupUseCase: Signup;

  @Inject(Signin)
  private signinUseCase: Signin;

  @Inject(RefreshTokenUseCase)
  private refreshTokenUseCase: RefreshTokenUseCase;

  @isPublic()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.OK)
  async login(@Body() signinDto: SigninDto) {
    const output = await this.signinUseCase.execute(signinDto);

    return UserPresenter.present(output, HttpStatus.OK, 'Usuário logado');
  }

  @isPublic()
  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req: Request) {
    return await this.refreshTokenUseCase.execute({
      refreshToken: req.headers['authorization']?.split(' ')[1],
    });
  }
}
