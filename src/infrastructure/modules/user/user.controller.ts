import {
  Controller,
  Body,
  Inject,
  Get,
  Query,
  Put,
  Patch,
  Delete,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { DeleteUser } from '@src/application/use-cases/user/delete-user/delete-user.use-case';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presenters/user.presenter';
import { UpdateUser } from '@src/application/use-cases/user/update-user/update-user.use-case';
import { UpdatePassword } from '@src/application/use-cases/user/update-password/update-password.use-case';
import { ListUsers } from '@src/application/use-cases/user/list-user/list-users.use-case';
import { BaseResponse } from '@src/shared/infrastructure/presenters/base-response.presenter';

@Controller('users')
export class UserController {
  @Inject(UpdateUser)
  private updateUserUseCase: UpdateUser;

  @Inject(UpdatePassword)
  private updatePasswordUseCase: UpdatePassword;

  @Inject(DeleteUser)
  private deleteUserUseCase: DeleteUser;

  @Inject(ListUsers)
  private listUsersUseCase: ListUsers;

  @Get()
  async search(@Query() searchParams: any) {
    const output = await this.listUsersUseCase.execute(searchParams);

    return UserCollectionPresenter.present(
      output.items,
      HttpStatus.OK,
      output.meta,
      'Lista de usuários encontrada',
    );
  }

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
