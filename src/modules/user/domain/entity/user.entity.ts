import { BadRequestError } from '@src/shared/domain/errors/bad-request.error';
import { CreateUserValidator } from './validator/create-user-entity.validator';
import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { Entity } from '@src/shared/domain/entities/Entity';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { Password } from '@src/shared/domain/value-objects/password/password.value-object';
import { UpdateUserValidator } from './validator/update-user-entity.validator';

export type UserEntityProps = {
  name: Name;
  email: Email;
  password: Password;
  createdAt?: Date;
};

export class UserEntity extends Entity<UserEntityProps> {
  private constructor(props: UserEntityProps, id?: string) {
    super(id, props);
  }

  public static create(props: UserEntityProps, id?: string): UserEntity {
    const validator = new CreateUserValidator();

    validator.validate(props);

    return new UserEntity(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  private set name(newName: Name) {
    this.props.name = newName;
  }

  private set email(newEmail: Email) {
    this.props.email = newEmail;
  }

  private set password(newPassword: Password) {
    this.props.password = newPassword;
  }

  public get name(): string {
    return this.props.name.value;
  }

  public get email(): string {
    return this.props.email.value;
  }

  public get password(): string {
    return this.props.password.value;
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public updateUser(props: Partial<UserEntityProps>): void {
    const validator = new UpdateUserValidator();
    validator.validate(props);

    if (props.name) this.name = props.name;
    if (props.email) this.email = props.email;
  }

  public updatePassword(newPassword: Password): void {
    if (this.props.password.equals(newPassword)) {
      throw new BadRequestError('A nova senha deve ser diferente da atual');
    }

    this.password = newPassword;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
    };
  }
}
