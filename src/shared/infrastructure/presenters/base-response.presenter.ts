import { ApiProperty } from '@nestjs/swagger';
import { MetaInterface } from '@src/shared/domain/interfaces/meta.interface';

export class BaseResponse<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: null, nullable: true })
  errorType: string | null;

  @ApiProperty({ example: null, nullable: true, type: [String] })
  errors: Array<{ property: string; message: string }> | null;

  @ApiProperty({ example: 'Operação realizada com sucesso' })
  message: string;

  @ApiProperty({ nullable: true })
  data: T | null;

  @ApiProperty({ nullable: true })
  meta: MetaInterface | null;

  constructor(partial: Partial<BaseResponse<T>>) {
    Object.assign(this, partial);
  }

  /**
   * Método estático para criar uma resposta de sucesso.
   * @param data - Dados a serem retornados na resposta.
   * @param status - Código de status HTTP.
   * @param message - Mensagem de sucesso.
   * @param meta - Dados de paginação, ordenação ou qualquer metadado adicional.
   * @returns Uma instância de BaseResponse representando uma resposta de sucesso.
   */
  static success<T>(
    data: T,
    status: number,
    message: string,
    meta?: MetaInterface,
  ): BaseResponse<T> {
    return new BaseResponse({
      statusCode: status,
      success: true,
      errorType: null,
      errors: null,
      message,
      data,
      meta: meta || null,
    });
  }

  /**
   * Método estático para criar uma resposta de erro.
   * @param status - Código de status HTTP.
   * @param errorType - Tipo de erro ocorrido.
   * @param errors - Lista de erros detalhados, cada um com propriedade e mensagem.
   * @param message - Mensagem geral do erro.
   * @returns Uma instância de BaseResponse representando uma resposta de erro.
   */
  static error(
    status: number,
    errorType: string,
    errors: Array<{ property: string; message: string }>,
    message: string,
  ): BaseResponse<null> {
    return new BaseResponse({
      statusCode: status,
      success: false,
      errorType: errorType,
      errors,
      message,
      data: null,
      meta: null,
    });
  }
}
