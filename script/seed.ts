// src/seed/main.ts
import { NestFactory } from '@nestjs/core';
import { SeedModule } from '../src/seed/seed.module';
import { SeedService } from '../src/seed/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(SeedModule);
  const seedService = app.get(SeedService);
  await seedService.run();
  await app.close();
}

bootstrap();