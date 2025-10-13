import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe()); 
  app.useGlobalPipes(new ValidationPipe());

  const port = configService.port;
  await app.listen(port);
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
}
bootstrap();