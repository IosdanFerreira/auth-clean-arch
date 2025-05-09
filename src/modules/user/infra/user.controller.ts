import {
  Controller,
  Body,
  Inject,
  Put,
  Patch,
  Delete,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserPresenter } from './presenters/user.presenter';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserUseCase } from '../application/use-cases/update-user/update-user.use-case';
import { UpdatePasswordUseCase } from '../application/use-cases/update-password/update-password.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user/delete-user.use-case';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '@src/shared/infrastructure/guards/jwt-auth.guard';
import { BaseResponse } from '@src/shared/infrastructure/presenters/base-response.presenter';

@ApiTags('users')
@Controller('users')
export class UserController {
  @Inject(UpdateUserUseCase)
  private updateUserUseCase: UpdateUserUseCase;

  @Inject(UpdatePasswordUseCase)
  private updatePasswordUseCase: UpdatePasswordUseCase;

  @Inject(DeleteUserUseCase)
  private deleteUserUseCase: DeleteUserUseCase;

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualiza um usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário atualizado com sucesso',
  })
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });

    return UserPresenter.present(
      output,
      HttpStatus.OK,
      'Usuário atualizado com sucesso',
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualiza a senha de um usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Senha atualizada com sucesso',
  })
  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    });

    return UserPresenter.present(
      output,
      HttpStatus.OK,
      'Senha atualizada com sucesso',
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Exclui um usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário excluído com sucesso',
  })
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id });

    return BaseResponse.success(
      null,
      HttpStatus.OK,
      'Usuário excluído com sucesso',
    );
  }
}
