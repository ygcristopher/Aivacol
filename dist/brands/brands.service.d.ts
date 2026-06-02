import { Repository } from 'typeorm';
import { Brand } from '../database/entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsService {
    private readonly brandsRepository;
    constructor(brandsRepository: Repository<Brand>);
    create(payload: CreateBrandDto, createdBy: string): Promise<Brand>;
    findAll(): Promise<Brand[]>;
    findOne(id: number): Promise<Brand>;
    update(id: number, payload: UpdateBrandDto): Promise<Brand>;
    remove(id: number): Promise<void>;
    private handleDatabaseError;
}
