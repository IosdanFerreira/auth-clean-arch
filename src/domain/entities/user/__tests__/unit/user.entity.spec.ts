import { UserEntity, UserEntityProps } from '../../user.entity';
import { UserDataBuilder } from '../../testing/helpers/user-data-builder';

describe('UserEntity unit tests', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let sut: UserEntity;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userEntityProps: UserEntityProps;

  beforeEach(() => {
    // user props
    userEntityProps = UserDataBuilder({});

    // System Under Test
    sut = new UserEntity(userEntityProps);
  });

  it('should test the constructor method of UserEntity', () => {
    expect(sut).toBeInstanceOf(UserEntity);
    expect(sut.userEntityProps.name).toEqual(userEntityProps.name);
    expect(sut.userEntityProps.email).toEqual(userEntityProps.email);
    expect(sut.userEntityProps.password).toEqual(userEntityProps.password);
    expect(sut.userEntityProps.createdAt).toBeInstanceOf(Date);
    expect(sut.userEntityProps.updatedAt).toBeInstanceOf(Date);
  });

  it('should test a getter of name field', () => {
    expect(sut.userEntityProps.name).toBeDefined();
    expect(sut.userEntityProps.name).toEqual(userEntityProps.name);
    expect(typeof sut.userEntityProps.name).toBe('string');
  });
  it('should test a getter of email field', () => {
    expect(sut.userEntityProps.email).toBeDefined();
    expect(sut.userEntityProps.email).toEqual(userEntityProps.email);
    expect(typeof sut.userEntityProps.email).toBe('string');
  });

  it('should test a getter of password field', () => {
    expect(sut.userEntityProps.password).toBeDefined();
    expect(sut.userEntityProps.password).toEqual(userEntityProps.password);
    expect(typeof sut.userEntityProps.password).toBe('string');
  });

  it('should test a getter of createdAt field', () => {
    expect(sut.userEntityProps.createdAt).toBeDefined();
    expect(sut.userEntityProps.createdAt).toBeInstanceOf(Date);
  });

  it('should test a getter of updatedAt field', () => {
    expect(sut.userEntityProps.updatedAt).toBeDefined();
    expect(sut.userEntityProps.updatedAt).toBeInstanceOf(Date);
  });
});
