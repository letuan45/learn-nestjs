// import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useLogger(app.get(CustomLoggerService));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
