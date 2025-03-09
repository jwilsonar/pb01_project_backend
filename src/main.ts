import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Empleados')
    .setDescription('API REST para la gestión de empleados y documentos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Configuración global de pipes
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de CORS
  app.enableCors();

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
