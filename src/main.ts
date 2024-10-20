import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    bodyParser: true,
    rawBody: true,
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Skipee API')
    .setDescription('Skipee API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .setExternalDoc('Postman Collection', '/api-json')
    .addServer('http://localhost:5001', 'Local Server')
    .addServer('https://skipee-backend.onrender.com', 'Render Server')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
