import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '@src/shared/infrastructure/presenters/base-response.presenter';
import { MetaInterface } from '@src/shared/domain/interfaces/meta.interface';
import { MetaPresenter } from '@src/shared/infrastructure/presenters/pagination.presenter';
import { Transform } from 'class-transformer';
import { UserOutputDto } from '@src/application/use-cases/user/_dto/user-output.dto';

export class UserPresenter {
  @ApiProperty({ description: 'Identificação do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'E-mail do usuário' })
  email: string;

  @ApiProperty({ description: 'Token de acesso' })
  accessToken?: string | null;

  @ApiProperty({ description: 'Data de criação do usuário' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(userDto: UserOutputDto) {
    this.id = userDto.id;
    this.name = userDto.name;
    this.email = userDto.email;
    this.createdAt = userDto.createdAt;

    if (userDto.accessToken) {
      this.accessToken = userDto.accessToken ?? null;
    }
  }

  static present(userDto: UserOutputDto, statusCode: number, message: string) {
    return BaseResponse.success(
      new UserPresenter(userDto),
      statusCode,
      message,
    );
  }
}

export class UserCollectionPresenter {
  static present(
    items: UserOutputDto[],
    statusCode: number,
    meta: MetaInterface,
    message: string,
  ) {
    return BaseResponse.success(
      items.map((item) => new UserPresenter(item)),
      statusCode,
      message,
      new MetaPresenter(meta),
    );
  }
}
