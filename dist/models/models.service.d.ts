import { Repository } from 'typeorm';
import { Brand } from '../database/entities/brand.entity';
import { Model } from '../database/entities/model.entity';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
export declare class ModelsService {
    private readonly modelsRepository;
    private readonly brandsRepository;
    constructor(modelsRepository: Repository<Model>, brandsRepository: Repository<Brand>);
    create(payload: CreateModelDto, createdBy: string): Promise<Model>;
    findAll(): Promise<Model[]>;
    findOne(id: number): Promise<Model>;
    update(id: number, payload: UpdateModelDto): Promise<Model>;
    remove(id: number): Promise<void>;
    private ensureBrandExists;
    private handleDatabaseError;
}
