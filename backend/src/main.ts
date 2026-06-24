import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Maison API')
    .setDescription('Backend API documentation for Maison portals')
    .setVersion('1.0')
    .addCookieAuth('accessToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
      description: 'JWT access token stored in an HttpOnly cookie',
    })
    .addCookieAuth('refreshToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refreshToken',
      description: 'JWT refresh token stored in an HttpOnly cookie',
    })
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    process.env.SWAGGER_PATH ?? 'docs',
    app,
    swaggerDocument,
    {
      swaggerOptions: {
        withCredentials: true,
      },
    },
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
