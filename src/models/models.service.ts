import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Brand } from '../database/entities/brand.entity';
import { Model } from '../database/entities/model.entity';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

type MssqlDriverError = {
  number?: number;
};

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model)
    private readonly modelsRepository: Repository<Model>,
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  async create(payload: CreateModelDto, createdBy: string): Promise<Model> {
    await this.ensureBrandExists(payload.brandId ?? null);

    const model = this.modelsRepository.create({
      name: payload.name.trim(),
      brandId: payload.brandId ?? null,
      createdBy,
    });

    try {
      return await this.modelsRepository.save(model);
    } catch (error: unknown) {
      this.handleDatabaseError(error, 'Model');
    }
  }

  findAll(): Promise<Model[]> {
    return this.modelsRepository.find({
      relations: { brand: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Model> {
    const model = await this.modelsRepository.findOne({
      where: { id },
      relations: { brand: true },
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    return model;
  }

  async update(id: string, payload: UpdateModelDto): Promise<Model> {
    const model = await this.modelsRepository.findOne({ where: { id } });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    if (payload.brandId !== undefined) {
      await this.ensureBrandExists(payload.brandId ?? null);
      model.brandId = payload.brandId ?? null;
    }

    if (payload.name !== undefined) {
      model.name = payload.name.trim();
    }

    try {
      return await this.modelsRepository.save(model);
    } catch (error: unknown) {
      this.handleDatabaseError(error, 'Model');
    }
  }

  async remove(id: string): Promise<void> {
    const model = await this.modelsRepository.findOne({ where: { id } });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    try {
      await this.modelsRepository.remove(model);
    } catch (error: unknown) {
      this.handleDatabaseError(error, 'Model');
    }
  }

  private async ensureBrandExists(brandId: string | null): Promise<void> {
    if (brandId === null) {
      return;
    }

    const brandExists = await this.brandsRepository.existsBy({ id: brandId });

    if (!brandExists) {
      throw new NotFoundException('Brand not found');
    }
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
