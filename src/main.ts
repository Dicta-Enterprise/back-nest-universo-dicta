import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // 👈 Import necesario
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const logger = new Logger('API');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // --- SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('API Universo Dicta')
    .setDescription('API de la aplicacion de universo dicta')
    .setVersion('1.0')
    .addCookieAuth('accessToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger
  SwaggerModule.setup('api/swagger', app, document);

  // Scalar (ANTES del listen)
  app.use(
    '/api/scalar',
    apiReference({
      content: document,
    }),
  );

  await app.listen(envs.port);

  logger.log(`API corriendo en http://localhost:${envs.port}/api`);
  logger.log(`Swagger: http://localhost:${envs.port}/api/swagger`);
  logger.log(`Scalar:  http://localhost:${envs.port}/api/scalar`);
}
bootstrap();
