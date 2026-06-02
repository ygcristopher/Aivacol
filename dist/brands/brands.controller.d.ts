import { Request } from 'express';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandsService } from './brands.service';
type AuthenticatedRequest = Request & {
    user: {
        username: string;
    };
};
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    create(payload: CreateBrandDto, request: AuthenticatedRequest): Promise<import("../database/entities/brand.entity").Brand>;
    findAll(): Promise<import("../database/entities/brand.entity").Brand[]>;
    findOne(id: number): Promise<import("../database/entities/brand.entity").Brand>;
    update(id: number, payload: UpdateBrandDto): Promise<import("../database/entities/brand.entity").Brand>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
export {};
