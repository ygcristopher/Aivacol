import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { AppModule } from '../../app.module';
import { User } from '../entities/user.entity';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);
    const repository = dataSource.getRepository(User);

    const username = process.env.SEED_ADMIN_USERNAME || 'aivacol';
    const email = process.env.SEED_ADMIN_EMAIL || 'aivacol@local.test';
    const password = process.env.SEED_ADMIN_PASSWORD || 'Aivacol@123';

    const existing = await repository.findOne({
      where: [{ username }, { email }],
    });

    if (existing) {
      console.log(`Seed skipped: user ${username} already exists.`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = repository.create({
      username,
      email,
      passwordHash,
      createdBy: 'seed',
    });

    await repository.save(user);
    console.log(`Seed completed: user ${username} created.`);
  } finally {
    await app.close();
  }
}

runSeed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
