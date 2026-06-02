import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Brand } from '../database/entities/brand.entity';
import { Model } from '../database/entities/model.entity';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';

@Module({
  imports: [TypeOrmModule.forFeature([Model, Brand])],
  controllers: [ModelsController],
  providers: [ModelsService],
})
export class ModelsModule {}
