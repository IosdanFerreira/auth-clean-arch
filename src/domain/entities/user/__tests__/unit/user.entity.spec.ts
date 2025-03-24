import { UserEntity, UserEntityProps } from '../../user.entity';

import { UserDataBuilder } from '../../testing/helpers/user-data-builder';

describe('UserEntity unit tests', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let sut: UserEntity;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userEntityProps: UserEntityProps;

  beforeEach(() => {
    UserEntity.validate = jest.fn();
    // user props
    userEntityProps = UserDataBuilder({});

    // System Under Test
    sut = new UserEntity(userEntityProps);
  });

  it('should test the constructor method of UserEntity', () => {
    expect(UserEntity.validate).toHaveBeenCalled();
    expect(sut).toBeInstanceOf(UserEntity);
    expect(sut.props.name).toEqual(userEntityProps.name);
    expect(sut.props.email).toEqual(userEntityProps.email);
    expect(sut.props.password).toEqual(userEntityProps.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('should test a getter of name field', () => {
    expect(sut.props.name).toBeDefined();
    expect(sut.props.name).toEqual(userEntityProps.name);
    expect(typeof sut.props.name).toBe('string');
  });

  it('should test a setter of name field', () => {
    sut['name'] = 'new name';

    expect(sut.props.name).toEqual('new name');
    expect(typeof sut.props.name).toBe('string');
  });

  it('should test a getter of email field', () => {
    expect(sut.props.email).toBeDefined();
    expect(sut.props.email).toEqual(userEntityProps.email);
    expect(typeof sut.props.email).toBe('string');
  });

  it('should test a getter of password field', () => {
    expect(sut.props.password).toBeDefined();
    expect(sut.props.password).toEqual(userEntityProps.password);
    expect(typeof sut.props.password).toBe('string');
  });

  it('should test a setter of password field', () => {
    sut['password'] = 'other password';

    expect(sut.props.password).toEqual('other password');
    expect(typeof sut.props.password).toBe('string');
  });

  it('should test a getter of createdAt field', () => {
    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('should test update a user', () => {
    sut.update('new name');

    expect(sut.props.name).toEqual('new name');
  });

  it('should test update a password', () => {
    sut.updatePassword('new password');

    expect(sut.props.password).toEqual('new password');
  });
});
