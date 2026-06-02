import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Model } from '../database/entities/model.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Model])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
