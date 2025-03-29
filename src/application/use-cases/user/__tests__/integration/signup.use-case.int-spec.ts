import { Test, TestingModule } from '@nestjs/testing';

import { AuthRepositoryDatabase } from '@src/infrastructure/modules/user/database/prisma/repositories/user-prisma.repository';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { DatabaseModule } from '@src/shared/infrastructure/database/database.module';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { PrismaClient } from '@prisma/client';
import { Signup } from '../../signup.use-case';
import { execSync } from 'node:child_process';

describe('SignupUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: Signup;
  let repository: AuthRepositoryDatabase;
  let module: TestingModule;
  let hashProvider: HashProviderInterface;

  beforeAll(async () => {
    execSync('npx dotenv-cli -e .env.test -- npx prisma migrate deploy');

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new AuthRepositoryDatabase(prismaService as any);
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new Signup(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a user', async () => {
    const props = {
      name: 'test name',
      email: 'a@a.com',
      password: 'TestPassword123',
    };

    const output = await sut.execute(props);

    expect(output.id).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
