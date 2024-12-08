import { UserDataBuilder } from '../../../testing/helpers/user-data-builder';
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '../../user.validator';

describe('UserValidator unit tests', () => {
  let sut: UserValidator;

  beforeEach(() => {
    sut = UserValidatorFactory.create();
  });

  describe('Name field', () => {
    it('should return validation errors when the name field is invalid ', () => {
      const isValid = sut.validate(null as any);

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name should not be empty',
        'name must be a string',
      ]);
    });

    it('should return validation error when the name field is empty ', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        name: '',
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual(['name should not be empty']);
    });

    it('should return validation error when the name field is not a string ', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        name: 10 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
      ]);
    });

    it('should return validation error when the name field is more than 255 caracteres ', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        name: 'a'.repeat(256),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('should return true when the name field is valid ', () => {
      const props = UserDataBuilder({});
      const isValid = sut.validate({ ...props });

      expect(isValid).toBeTruthy();
      expect(sut.validatedData).toStrictEqual(new UserRules({ ...props }));
    });
  });

  describe('Email field', () => {
    it('should return validation errors when the email field is invalid ', () => {
      const isValid = sut.validate(null as any);

      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be an email',
      ]);
    });

    it('should return validation error when the email field is empty ', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        email: '',
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be an email',
      ]);
    });

    it('should return validation error when the name field is not a valid email ', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        email: 'testqqq',
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual(['email must be an email']);
    });

    it('should return true when the email field is valid ', () => {
      const props = UserDataBuilder({});
      const isValid = sut.validate({ ...props });

      expect(isValid).toBeTruthy();
      expect(sut.validatedData).toStrictEqual(new UserRules({ ...props }));
    });
  });

  describe('Password field', () => {
    it('should return validation errors when the password field is invalid ', () => {
      const isValid = sut.validate(null as any);

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password must be longer than or equal to 8 characters',
        'password should not be empty',
        'password must be a string',
      ]);
    });

    it('should return validation errors when the password field is empty ', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        password: '',
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password must be longer than or equal to 8 characters',
        'password should not be empty',
      ]);
    });

    it('should return validation errors when the password field is not a string ', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        password: 123 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password must be longer than or equal to 8 characters',
        'password must be a string',
      ]);
    });

    it('should return validation errors when the password field is must be longer than or equal to 8 characters but is not a string', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        password: 12345678 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password must be longer than or equal to 8 characters',
        'password must be a string',
      ]);
    });
    it('should return validation errors when the password field is less be longer than or equal to 8 characters', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        password: '1234567',
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password must be longer than or equal to 8 characters',
      ]);
    });

    it('should return true when the password field is valid ', () => {
      const props = UserDataBuilder({});
      const isValid = sut.validate({ ...props });

      expect(isValid).toBeTruthy();
      expect(sut.validatedData).toStrictEqual(new UserRules({ ...props }));
    });
  });

  describe('CreatedAt field', () => {
    it('should return validation errors when the createdAt field is not Date instance, but is a number', () => {
      const props = UserDataBuilder({});
      const isValid = sut.validate({ ...props, createdAt: 12 as any });

      expect(isValid).toBeFalsy();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });

    it('should return validation errors when the createdAt field is not Date instance, but is a string', () => {
      const props = UserDataBuilder({});
      const isValid = sut.validate({ ...props, createdAt: 'test' as any });

      expect(isValid).toBeFalsy();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });

    it('should return true when the createdAt field is valid', () => {
      const props = UserDataBuilder({});
      const isValid = sut.validate({ ...props });

      expect(isValid).toBeTruthy();
      expect(sut.validatedData).toStrictEqual(new UserRules(props));
    });
  });
});
