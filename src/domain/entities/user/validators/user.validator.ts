import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserEntityProps } from '../user.entity';
import { ClassValidatorFields } from '@src/shared/domain/validators/class-validator-fields';

/**
 * Classe que define as regras de validação para os campos de um usuário.
 */
export class UserRules {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor({ email, name, password, createdAt }: UserEntityProps) {
    Object.assign(this, { email, name, password, createdAt });
  }
}

/**
 * Classe de validação para o objeto `UserRules`.
 *
 * Estende `ClassValidatorFields` para aplicar as regras definidas em `UserRules`.
 */
export class UserValidator extends ClassValidatorFields<UserRules> {
  /**
   * Realiza a validação de um objeto do tipo `UserEntityProps` com base nas regras de `UserRules`.
   *
   * @param data - Dados do usuário a serem validados.
   * @returns `true` se os dados forem válidos; caso contrário, `false`.
   */
  validate(data: UserEntityProps): boolean {
    return super.validate(new UserRules(data ?? ({} as UserEntityProps)));
  }
}

/**
 * Essa classe segue o padrão Factory, fornecendo um método estático
 * para instanciar objetos do tipo `UserValidator`.
 * * Cria e retorna uma nova instância de `UserValidator`.
 *
 * @returns Uma instância de `UserValidator`.
 */
export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
