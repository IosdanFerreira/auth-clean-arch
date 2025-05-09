import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { SignUpUseCase } from '../application/use-cases/signup/signup.use-case';
import { SignInUseCase } from '../application/use-cases/signin/signin.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token/refresh-token.use-case';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { UserPresenter } from '@src/modules/user/infra/presenters/user.presenter';
import { isPublic } from '@src/shared/infrastructure/decorators/is-public.decorator';
import { RefreshJwtAuthGuard } from '@src/shared/infrastructure/guards/refresh-jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Inject(SignUpUseCase)
  private signupUseCase: SignUpUseCase;

  @Inject(SignInUseCase)
  private signinUseCase: SignInUseCase;

  @Inject(RefreshTokenUseCase)
  private refreshTokenUseCase: RefreshTokenUseCase;

  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiCreatedResponse({
    description: 'Novo usuário cadastrado',
    type: UserPresenter,
  })
  @ApiBody({ type: SignupDto })
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

  @ApiOperation({ summary: 'Realiza o login de um usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário logado com sucesso',
    type: UserPresenter,
  })
  @ApiBody({ type: SigninDto })
  @isPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() signinDto: SigninDto) {
    const output = await this.signinUseCase.execute(signinDto);

    return UserPresenter.present(output, HttpStatus.OK, 'Usuário logado');
  }

  @ApiOperation({ summary: 'Realiza o refresh de um token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token de refresh atualizado com sucesso',
    type: UserPresenter,
  })
  @ApiBearerAuth()
  @UseGuards(RefreshJwtAuthGuard)
  @isPublic()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req: Request) {
    return await this.refreshTokenUseCase.execute({
      refreshToken: req.headers['authorization']?.split(' ')[1],
    });
  }
}
