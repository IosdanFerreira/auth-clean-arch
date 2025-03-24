import { PrismaClient, User } from '@prisma/client';
import { execSync } from 'node:child_process';
import { UserModelMapper } from '../../user-model.mapper';
import { UserEntity } from '@src/domain/entities/user/user.entity';

describe('User model mapper integrations tests', () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    execSync('npx dotenv-cli -e .env.test -- npx prisma migrate deploy');
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    props = {
      id: '698b0c7e-c68b-4cfd-99dd-aac08024be8d',
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: 'TestPassword123',
      createdAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('Should throw error when user model is invalid', () => {
    const input = Object.assign({}, props, {
      name: null as any,
    });

    expect(() => UserModelMapper.toEntity(input)).toThrow(
      new Error('An entity not be loaded'),
    );
  });

  it('Should convert a user model to user entity', async () => {
    const input: User = await prismaService.user.create({
      data: props,
    });

    const sut = UserModelMapper.toEntity(input);

    expect(sut.toJson()).toStrictEqual(props);
    expect(sut).toBeInstanceOf(UserEntity);
  });
});
