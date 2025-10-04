import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // 👈 Import necesario
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('API');

  // 👈 Usamos NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE,PATCH',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // --- SERVIR ARCHIVOS ESTÁTICOS ---
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads/', // URL pública
  });

  // --- SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('API Universo Dicta')
    .setDescription('API de la aplicacion de universo dicta')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(envs.port);

  logger.log(`API corriendo en el puerto ${envs.port}`);
  logger.log(`API corriendo en la BD ${envs.databaseUrl}`);
}
bootstrap();
