import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseModule } from '@src/shared/infrastructure/database/database.module';
import { EnvConfigModule } from '@src/shared/infrastructure/config/env-config/env-config.module';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SignupDto } from '../../dto/signup.dto';
import { UserController } from '../../user.controller';
import { UserModule } from '../../user.module';
import { UserRepository } from '@src/domain/repositories/user.repository';
import { applyGlobalConfig } from '@src/global-config';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { setupPrismaTests } from '@src/shared/infrastructure/database/prisma/testing/setup-prisma-tests';

describe('UsersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository;
  let signupDto: SignupDto;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule.forRoot(),
        UserModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get<UserRepository>('UserRepository');
  });

  beforeEach(async () => {
    signupDto = {
      name: 'test name',
      email: 'a@a.com',
      password: 'TestPassword123',
    };
    await prismaService.user.deleteMany();
  });

  describe('POST /users', () => {
    it('should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(signupDto)
        .expect(201);
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      const user = await repository.findByID(res.body.data.id);
      const presenter = UserController.UserToResponse(user.toJson());
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({})
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'password should not be empty',
        'password must be a string',
      ]);
    });

    it('should return a error with 422 code when the name field is invalid', async () => {
      delete signupDto.name;
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(signupDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ]);
    });

    it('should return a error with 422 code when the email field is invalid', async () => {
      delete signupDto.email;
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(signupDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
      ]);
    });

    it('should return a error with 422 code when the password field is invalid', async () => {
      delete signupDto.password;
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(signupDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
      ]);
    });

    it('should return a error with 422 code with invalid field provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(Object.assign(signupDto, { xpto: 'fake' }))
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual(['property xpto should not exist']);
    });
  });
});
