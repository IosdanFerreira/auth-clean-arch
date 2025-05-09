import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { applyGlobalConfig } from './global-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS Boilerplate')
    .setDescription(
      'Uma estrutura pronta para desenvolvimento de APIs REST em Node.js, utilizando NestJS com TypeScript. Segue os princípios de DDD (Domain-Driven Design), Clean Architecture e inclui testes automatizados para garantir qualidade e escalabilidade',
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Informar o JWT para autorizar o acesso',
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  applyGlobalConfig(app);

  await app.listen(3001, '0.0.0.0');
}

bootstrap();
