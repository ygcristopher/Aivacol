import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Brand } from '../database/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
})
export class BrandsModule {}
