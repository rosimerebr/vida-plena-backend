import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8100', // ou '*', para liberar para todos (apenas para testes)
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
