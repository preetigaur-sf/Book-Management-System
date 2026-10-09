import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.enableCors();

  let port = Number(process.env.PORT) || 3002;

  while (true) {
    try {
      await app.listen(port);
      console.log(`Auth service running on http://localhost:${port}`);
      break;
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err?.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is busy; trying port ${port + 1}...`);
        port += 1;
        continue;
      }
      throw error;
    }
  }
}

bootstrap();