import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3000;

  // Enable CORS for frontend running on localhost:3001
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  await app.listen(PORT);
  console.log(`Server is running on: http://localhost:${PORT}`);
}

bootstrap();
