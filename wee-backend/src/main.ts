import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ServiceExceptionToHttpExecptionFilter } from './exception/service.exception.to.http.exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());  // 미들웨어 설정
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ServiceExceptionToHttpExecptionFilter())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));


  const config = new DocumentBuilder()
    .setTitle('ai-weeclass API')
    .setDescription('API 문서입니다')
    .setVersion('.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        description: 'JWT token',
        in: 'header'
      }
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}

bootstrap();
