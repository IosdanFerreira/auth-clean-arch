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
