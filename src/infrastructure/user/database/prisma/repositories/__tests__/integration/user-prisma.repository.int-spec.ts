import {
  SearchParams,
  SearchResult,
} from '@src/shared/domain/repositories/searchable-repository-contract';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthRepositoryDatabase } from '../../user-prisma.repository';
import { DatabaseModule } from '@src/shared/infrastructure/database/database.module';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { PrismaClient } from '@prisma/client';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { execSync } from 'node:child_process';

describe('User repository database integrations tests', () => {
  const prismaService = new PrismaClient();
  let sut: AuthRepositoryDatabase;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let module: TestingModule;

  beforeAll(async () => {
    execSync('npx dotenv-cli -e .env.test -- npx prisma migrate deploy');
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    sut = new AuthRepositoryDatabase(prismaService as any);
  });

  it('Should throw error when user not found', () => {
    expect(() => sut.findByID('fake-id')).rejects.toThrow(
      new NotFoundError('User not found'),
    );
  });

  it('should insert a new entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await sut.insert(entity);

    const result = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });

    expect(result).toStrictEqual(entity.toJson());
  });

  it('should returns all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await prismaService.user.create({
      data: entity.toJson(),
    });

    const entities = await sut.findAll();

    expect(entities).toHaveLength(1);

    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    entities.map((item) =>
      expect(item.toJson()).toStrictEqual(entity.toJson()),
    );
  });

  it('should throws error on update when a entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    expect(() => sut.update(entity._id, entity)).rejects.toThrow(
      new NotFoundError('User not found'),
    );
  });
  it('should update a entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJson(),
    });
    entity.update('new name');
    await sut.update(entity._id, entity);
    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });
    expect(output.name).toBe('new name');
  });

  it('should throws error when a entity not found', async () => {
    await expect(() => sut.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError(`User not found`),
    );
  });
  it('should finds a entity by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }));
    await prismaService.user.create({
      data: entity.toJson(),
    });
    const output = await sut.findByEmail('a@a.com');
    expect(output.toJson()).toStrictEqual(entity.toJson());
  });
  it('should throws error when a entity found by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }));
    await prismaService.user.create({
      data: entity.toJson(),
    });
    await expect(() => sut.emailExist('a@a.com')).rejects.toThrow(
      new Error(`Email already exist`),
    );
  });
  it('should not finds a entity by email', async () => {
    expect.assertions(0);
    await sut.emailExist('a@a.com');
  });

  it('should apply only pagination when the other params are null', async () => {
    const createdAt = new Date();
    const entities: UserEntity[] = [];
    const arrange = Array(16).fill(UserDataBuilder({}));
    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity({
          ...element,
          name: `User${index}`,
          email: `test${index}@mail.com`,
          createdAt: new Date(createdAt.getTime() + index),
        }),
      );
    });
    await prismaService.user.createMany({
      data: entities.map((item) => item.toJson()),
    });
    const searchOutput = await sut.search(new SearchParams());
    expect(searchOutput).toBeInstanceOf(SearchResult);
    expect(searchOutput.totalItems).toBe(16);
    searchOutput.items.forEach((item) => {
      expect(item).toBeInstanceOf(UserEntity);
    });
  });
});
