import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { DataSource } from 'typeorm';

import { Brand } from './entities/brand.entity';
import { Model } from './entities/model.entity';
import { User } from './entities/user.entity';
import { Vehicle } from './entities/vehicle.entity';

const appDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 1433),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Brand, Model, Vehicle],
  migrations: ['src/database/migrations/*.ts'],
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    connectTimeout: 15000,
  },
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
});

export default appDataSource;
