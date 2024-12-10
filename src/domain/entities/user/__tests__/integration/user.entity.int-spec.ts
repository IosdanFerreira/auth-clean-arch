import { EntityValidationError } from '@src/shared/domain/errors/validation-error';
import { UserDataBuilder } from '../../testing/helpers/user-data-builder';
import { UserEntity, UserEntityProps } from '../../user.entity';

describe('UserEntity integrations tests', () => {
  describe('Constructor method', () => {
    describe('Name Field tests', () => {
      it('should throw an error when try to create a user with name field null', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          name: null as any,
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });

      it('should throw an error when try to create a user with name field empty', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          name: '',
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });

      it('should throw an error when try to create a user with name field as a number', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          name: 2 as any,
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });

      it('should throw an error when try to create a user with name field longer than 255 caracteres', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          name: 'a'.repeat(256),
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });
    });

    describe('Email Field tests', () => {
      it('should throw an error when try to create a user with email field null', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          email: null as any,
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });

      it('should throw an error when try to create a user with email field empty', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          email: '',
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });

      it('should throw an error when try to create a user with email field as a invalid email', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          email: 'invalidemail',
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });
    });

    describe('Password Field tests', () => {
      it('should throw an error when try to create a user with password field null', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          password: null as any,
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });

      it('should throw an error when try to create a user with password field empty', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          password: '',
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });

      it('should throw an error when try to create a user with password field as a number', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          password: 12345678 as any,
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });

      it('should throw an error when try to create a user with password field less then 8 caracteres', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          password: '1234567',
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });
    });

    describe('CreatedAt Field tests', () => {
      it('should throw an error when try to create a user with createdAt field not being a data', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          createdAt: 'test' as any,
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });

      it('should throw an error when try to create a user with createdAt field as a invalid date', () => {
        const props: UserEntityProps = {
          ...UserDataBuilder({}),
          createdAt: '1/1/2000' as any,
        };

        expect(() => new UserEntity(props)).toThrow(EntityValidationError);
      });
    });

    it('should return a valid user', () => {
      expect.assertions(0);

      const props = { ...UserDataBuilder({}) };

      new UserEntity(props);
    });
  });

  describe('Update method', () => {
    it('should throw an error when update a user with a null name', () => {
      const userEntity = new UserEntity(UserDataBuilder({}));

      expect(() => userEntity.update(null)).toThrow(EntityValidationError);
    });

    it('should throw an error when update a user with a empty name', () => {
      const userEntity = new UserEntity(UserDataBuilder({}));

      expect(() => userEntity.update('')).toThrow(EntityValidationError);
    });

    it('should throw an error when update a user with name field as a number', () => {
      const userEntity = new UserEntity(UserDataBuilder({}));

      expect(() => userEntity.update(123 as any)).toThrow(
        EntityValidationError,
      );
    });

    it('should throw an error when update a user with name longer than 255 caracteres', () => {
      const userEntity = new UserEntity(UserDataBuilder({}));

      expect(() => userEntity.update('a'.repeat(256))).toThrow(
        EntityValidationError,
      );
    });

    it('should update user', () => {
      expect.assertions(0);

      const userEntity = new UserEntity(UserDataBuilder({}));

      userEntity.update('valid name');
    });
  });

  describe('Update password method', () => {
    it('should throw an error when update a user password with a invalid password', () => {
      const userEntity = new UserEntity(UserDataBuilder({}));

      expect(() => userEntity.updatePassword(null)).toThrow(
        EntityValidationError,
      );
    });

    it('should throw an error when update a user password with a empty password', () => {
      const userEntity = new UserEntity(UserDataBuilder({}));

      expect(() => userEntity.updatePassword('')).toThrow(
        EntityValidationError,
      );
    });

    it('should throw an error when update a user password with password as a number type', () => {
      const userEntity = new UserEntity(UserDataBuilder({}));

      expect(() => userEntity.updatePassword(12345678 as any)).toThrow(
        EntityValidationError,
      );
    });

    it('should throw an error when update a user password with password less than 8 caracteres', () => {
      const userEntity = new UserEntity(UserDataBuilder({}));

      expect(() => userEntity.updatePassword('1234567')).toThrow(
        EntityValidationError,
      );
    });

    it('should update password', () => {
      expect.assertions(0);

      const userEntity = new UserEntity(UserDataBuilder({}));

      userEntity.updatePassword('validPassword');
    });
  });
});
