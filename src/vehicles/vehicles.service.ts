import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { QueryFailedError, Repository } from 'typeorm';

import { Model } from '../database/entities/model.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { RabbitmqService } from '../messaging/rabbitmq.service';
import { AuditService } from '../audit/audit.service';

type MssqlDriverError = {
  number?: number;
};

@Injectable()
export class VehiclesService {
  private readonly vehiclesListCacheKey = 'vehicles:list:v1';

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(Model)
    private readonly modelsRepository: Repository<Model>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly rabbitmq: RabbitmqService,
    private readonly audit: AuditService,
  ) {}

  async create(payload: CreateVehicleDto, createdBy: string): Promise<Vehicle> {
    await this.ensureModelExists(payload.modelId);

    const vehicle = this.vehiclesRepository.create({
      ...this.normalizeVehiclePayload(payload),
      modelId: payload.modelId,
      yearManufacture: payload.yearManufacture,
      createdBy,
    });

    try {
      const savedVehicle = await this.vehiclesRepository.save(vehicle);
      await this.invalidateVehiclesListCache();
      this.rabbitmq.publish('vehicle.created', { vehicle: savedVehicle });
      await this.audit.record('vehicle.created', savedVehicle);
      return savedVehicle;
    } catch (error: unknown) {
      this.handleDatabaseError(error, 'Vehicle');
    }
  }

  async findAll(): Promise<Vehicle[]> {
    const cachedVehicles = await this.cacheManager.get<Vehicle[]>(
      this.vehiclesListCacheKey,
    );

    if (cachedVehicles) {
      return cachedVehicles;
    }

    const vehicles = await this.vehiclesRepository.find({
      relations: {
        model: {
          brand: true,
        },
      },
      order: { id: 'ASC' },
    });

    await this.cacheManager.set(this.vehiclesListCacheKey, vehicles);
    return vehicles;
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id },
      relations: {
        model: {
          brand: true,
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async update(id: number, payload: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (payload.modelId !== undefined) {
      await this.ensureModelExists(payload.modelId);
      vehicle.modelId = payload.modelId;
    }

    if (payload.yearManufacture !== undefined) {
      vehicle.yearManufacture = payload.yearManufacture;
    }

    const normalizedPayload = this.normalizeVehiclePayload(payload);
    Object.assign(vehicle, normalizedPayload);

    try {
      const updatedVehicle = await this.vehiclesRepository.save(vehicle);
      await this.invalidateVehiclesListCache();
      this.rabbitmq.publish('vehicle.updated', { vehicle: updatedVehicle });
      await this.audit.record('vehicle.updated', updatedVehicle);
      return updatedVehicle;
    } catch (error: unknown) {
      this.handleDatabaseError(error, 'Vehicle');
    }
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    try {
      await this.vehiclesRepository.remove(vehicle);
      await this.invalidateVehiclesListCache();
      this.rabbitmq.publish('vehicle.removed', { vehicleId: vehicle.id });
      await this.audit.record('vehicle.removed', { id: vehicle.id });
    } catch (error: unknown) {
      this.handleDatabaseError(error, 'Vehicle');
    }
  }

  private async ensureModelExists(modelId: number): Promise<void> {
    const modelExists = await this.modelsRepository.existsBy({ id: modelId });

    if (!modelExists) {
      throw new NotFoundException('Model not found');
    }
  }

  private normalizeVehiclePayload(
    payload: Partial<CreateVehicleDto>,
  ): Partial<CreateVehicleDto> {
    return {
      plate: payload.plate?.trim().toUpperCase(),
      chassis: payload.chassis?.trim().toUpperCase(),
      renavam: payload.renavam?.trim(),
    };
  }

  private async invalidateVehiclesListCache(): Promise<void> {
    await this.cacheManager.del(this.vehiclesListCacheKey);
  }

  private handleDatabaseError(error: unknown, entityName: string): never {
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as MssqlDriverError;

      if (driverError.number === 2601 || driverError.number === 2627) {
        throw new ConflictException(`${entityName} already exists`);
      }

      if (driverError.number === 547) {
        throw new ConflictException(
          `${entityName} cannot be removed because it is in use`,
        );
      }
    }

    throw new InternalServerErrorException('Unexpected database error');
  }
}
