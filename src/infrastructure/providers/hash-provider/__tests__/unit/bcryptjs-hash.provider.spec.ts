import { BcryptjsHashProvider } from '../../bcryptjs-hash.provider';

describe('BcryptjsHashProvider unit tests', () => {
  let sut: BcryptjsHashProvider;

  beforeEach(() => {
    sut = new BcryptjsHashProvider();
  });

  it('Should return encrypted password', async () => {
    const input = {
      password: '12345678',
      salt: 6,
    };

    const hash = await sut.generateHash(input.password, input.salt);

    expect(hash).toBeDefined();
  });

  it('Should return false on invalid password and hash comparison', async () => {
    const input = {
      password: '12345678',
      salt: 6,
    };

    const hash = await sut.generateHash(input.password, input.salt);

    const result = await sut.compareHash('invalid-password', hash);

    expect(result).toBeFalsy();
  });

  it('Should return true on valid password and hash comparison', async () => {
    const input = {
      password: '12345678',
      salt: 6,
    };

    const hash = await sut.generateHash(input.password, input.salt);

    const result = await sut.compareHash(input.password, hash);

    expect(result).toBeTruthy();
  });
});
