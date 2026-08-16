import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { AppModule } from './app.module';

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations complete.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

async function seedIfEmpty() {
  const prisma = new PrismaClient();
  try {
    const courseCount = await prisma.course.count();
    if (courseCount === 0) {
      console.log('🌱 No courses found — running seed...');
      execSync('npx ts-node --project tsconfig.seed.json prisma/seed.ts', {
        stdio: 'inherit',
      });
      console.log('✅ Seed complete.');
    } else {
      console.log(`✅ Database already has ${courseCount} course(s) — skipping seed.`);
    }
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function bootstrap() {
  await runMigrations();
  await seedIfEmpty();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
