import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '@src/shared/infrastructure/presenters/base-response.presenter';
import { JwtTokenInterface } from '@src/modules/auth/application/interfaces';
import { MetaInterface } from '@src/shared/domain/interfaces/meta.interface';
import { MetaPresenter } from '@src/shared/infrastructure/presenters/pagination.presenter';
import { Transform } from 'class-transformer';
import { UserOutputDto } from '../../application/use-cases/_dto/user-output.dto';

export class UserPresenter {
  @ApiProperty({ description: 'Identificação do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'E-mail do usuário' })
  email: string;

  @ApiProperty({ description: 'Token de acesso' })
  accessToken?: JwtTokenInterface | null;

  @ApiProperty({ description: 'Token de atualização do token de acesso' })
  refreshToken?: JwtTokenInterface | null;

  @ApiProperty({ description: 'Data de criação do usuário' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização do usuário' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date;

  /**
   * Construtor da classe UserPresenter.
   * @param userDto Dados do usuário obtidos da camada de negócios.
   */
  constructor(userDto: UserOutputDto) {
    /**
     * Identificação do usuário.
     */
    this.id = userDto.id;

    /**
     * Nome do usuário.
     */
    this.name = userDto.name;

    /**
     * E-mail do usuário.
     */
    this.email = userDto.email;

    /**
     * Data de criação do usuário.
     */
    this.createdAt = userDto.createdAt;

    /**
     * Token de acesso.
     * Caso o token de acesso seja nulo, o valor da propriedade accessToken
     * será nulo.
     */
    if (userDto.accessToken) {
      this.accessToken = userDto.accessToken ?? null;
    }

    /**
     * Token de atualização do token de acesso.
     * Caso o token de atualização seja nulo, o valor da propriedade refreshToken
     * será nulo.
     */
    if (userDto.refreshToken) {
      this.refreshToken = userDto.refreshToken ?? null;
    }
  }

  /**
   * Construtor da classe UserPresenter.
   * @param userDto Dados do usuário obtidos da camada de negócios.
   */
  static present(userDto: UserOutputDto, statusCode: number, message: string) {
    /**
     * Retorna uma resposta HTTP com dados do usuário.
     * @param userDto Dados do usuário obtidos da camada de negócios.
     * @param statusCode Código de status HTTP.
     * @param message Mensagem de sucesso.
     * @returns Uma resposta HTTP com dados do usuário.
     */
    return BaseResponse.success(
      new UserPresenter(userDto),
      statusCode,
      message,
    );
  }
}

export class UserCollectionPresenter {
  /**
   * Retorna uma resposta HTTP com dados de usuários.
   * @param items Dados dos usuários obtidos da camada de negócios.
   * @param statusCode Código de status HTTP.
   * @param meta Dados de paginação.
   * @param message Mensagem de sucesso.
   * @returns Uma resposta HTTP com dados de usuários.
   */
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
