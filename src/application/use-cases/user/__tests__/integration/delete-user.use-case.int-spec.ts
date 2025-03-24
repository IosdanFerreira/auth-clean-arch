import { Test, TestingModule } from '@nestjs/testing';

import { AuthRepositoryDatabase } from '@src/infrastructure/user/database/prisma/repositories/user-prisma.repository';
import { DatabaseModule } from '@src/shared/infrastructure/database/database.module';
import { DeleteUser } from '../../delete-user.use-case';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { PrismaClient } from '@prisma/client';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { execSync } from 'node:child_process';

describe('DeleteUserUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: DeleteUser;
  let repository: AuthRepositoryDatabase;
  let module: TestingModule;

  beforeAll(async () => {
    execSync('npx dotenv-cli -e .env.test -- npx prisma migrate deploy');

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new AuthRepositoryDatabase(prismaService as any);
  });

  beforeEach(async () => {
    sut = new DeleteUser(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('User not found'),
    );
  });

  it('should delete a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await prismaService.user.create({
      data: entity.toJson(),
    });

    await sut.execute({ id: entity._id });
    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });

    expect(output).toBeNull();

    const models = await prismaService.user.findMany();
    expect(models).toHaveLength(0);
  });
});
