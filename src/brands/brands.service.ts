import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Brand } from '../database/entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

type MssqlDriverError = {
  number?: number;
};

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  async create(payload: CreateBrandDto, createdBy: string): Promise<Brand> {
    const brand = this.brandsRepository.create({
      name: payload.name.trim(),
      createdBy,
    });

    try {
      return await this.brandsRepository.save(brand);
    } catch (error: unknown) {
      this.handleDatabaseError(error, 'Brand');
    }
  }

  findAll(): Promise<Brand[]> {
    return this.brandsRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandsRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  async update(id: number, payload: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandsRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (payload.name !== undefined) {
      brand.name = payload.name.trim();
    }

    try {
      return await this.brandsRepository.save(brand);
    } catch (error: unknown) {
      this.handleDatabaseError(error, 'Brand');
    }
  }

  async remove(id: number): Promise<void> {
    const brand = await this.brandsRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    try {
      await this.brandsRepository.remove(brand);
    } catch (error: unknown) {
      this.handleDatabaseError(error, 'Brand');
    }
  }

  private handleDatabaseError(error: unknown, entityName: string): never {
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as MssqlDriverError;

      if (driverError.number === 2601 || driverError.number === 2627) {
        throw new ConflictException(`${entityName} already exists`);
      }
    }

    throw new InternalServerErrorException('Unexpected database error');
  }
}
