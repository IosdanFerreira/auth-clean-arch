import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '@src/shared/infrastructure/presenters/base-response.presenter';
import { HttpStatus } from '@nestjs/common';
import { MetaInterface } from '@src/shared/domain/interfaces/meta.interface';
import { MetaPresenter } from '@src/shared/infrastructure/presenters/pagination.presenter';
import { Transform } from 'class-transformer';
import { UserOutputDto } from '@src/application/use-cases/user/dto/user-output.dto';

export class UserPresenter {
  @ApiProperty({ description: 'Identificação do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'E-mail do usuário' })
  email: string;

  @ApiProperty({ description: 'Data de criação do usuário' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: UserOutputDto) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.createdAt = output.createdAt;
  }
}

export class UserCollectionPresenter {
  static present(items: UserOutputDto[], meta: MetaInterface, message: string) {
    return BaseResponse.success(
      items.map((item) => new UserPresenter(item)),
      HttpStatus.OK,
      message,
      new MetaPresenter(meta),
    );
  }
}
