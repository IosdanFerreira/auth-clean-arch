import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { InvalidParamError } from '@src/shared/domain/errors/invalid-param.error';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { Password } from '@src/shared/domain/value-objects/password/password.value-object';
import { UserEntity } from '../../user.entity';

describe('UserEntity', () => {
  let sut: UserEntity;

  beforeEach(() => {
    sut = UserEntity.create({
      name: Name.create('John Doe'),
      email: Email.create('john.doe@example.com'),
      password: Password.create('Password123!'),
    });
  });

  it('should create a user entity with valid props', () => {
    expect(sut).toBeDefined();
    expect(sut.name).toStrictEqual('John Doe');
    expect(sut.email).toStrictEqual('john.doe@example.com');
    expect(sut.password).toStrictEqual('Password123!');
  });

  describe('Name prop', () => {
    it('should update the name', () => {
      const newName = Name.create('Jane Doe');
      sut.updateUser({ name: newName });

      expect(sut.name).toStrictEqual('Jane Doe');
    });

    it('should throw if name is not a Name value object', () => {
      expect(() => {
        UserEntity.create({
          name: 'NotAName' as any,
          email: Email.create('john.doe@example.com'),
          password: Password.create('Password123!'),
          createdAt: new Date(),
        });
      }).toThrow(new InvalidParamError('Nome deve ser uma instância de Name'));
    });
  });

  describe('Email prop', () => {
    it('should update the email', () => {
      const newEmail = Email.create('jane.doe@example.com');
      sut.updateUser({ email: newEmail });

      expect(sut.email).toStrictEqual('jane.doe@example.com');
    });

    it('should throw if email is not an Email value object', () => {
      expect(() => {
        UserEntity.create({
          name: Name.create('John Doe'),
          email: 'john@example.com' as any,
          password: Password.create('Password123!'),
          createdAt: new Date(),
        });
      }).toThrow(
        new InvalidParamError('Email deve ser uma instância de Email'),
      );
    });
  });

  describe('Password prop', () => {
    it('should update the password', () => {
      const newPassword = Password.create('NewPassword12!@');
      sut.updatePassword(newPassword);

      expect(sut.password).toStrictEqual('NewPassword12!@');
    });

    it('should throw if password is not a Password value object', () => {
      expect(() => {
        UserEntity.create({
          name: Name.create('John Doe'),
          email: Email.create('john.doe@example.com'),
          password: 'NotAPassword' as any,
          createdAt: new Date(),
        });
      }).toThrow(
        new InvalidParamError('Senha deve ser uma instância de Password'),
      );
    });
  });

  it('should not change createdAt when updating user', () => {
    const originalCreatedAt = sut.createdAt;
    sut.updateUser({ name: Name.create('Updated Name') });

    expect(sut.createdAt).toStrictEqual(originalCreatedAt);
  });

  it('should update updatedAt when updating user', async () => {
    const originalUpdatedAt = sut.updatedAt;

    await new Promise((resolve) => setTimeout(resolve, 1));

    sut.updateUser({ name: Name.create('Updated Name') });

    expect(sut.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime(),
    );
  });

  it('should update updatedAt when updating password', async () => {
    const originalUpdatedAt = sut.updatedAt;

    await new Promise((resolve) => setTimeout(resolve, 1));

    sut.updatePassword(Password.create('NewPassword123!'));

    expect(sut.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime(),
    );
  });

  it('should return a correct JSON representation', () => {
    const userJson = sut.toJSON();

    const expected = {
      id: sut.id,
      name: sut.name,
      email: sut.email,
      password: sut.password,
      createdAt: sut.createdAt,
      updatedAt: sut.updatedAt,
    };

    expect(userJson).toEqual(expected);
  });
});
