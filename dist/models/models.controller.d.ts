import { Request } from 'express';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { ModelsService } from './models.service';
type AuthenticatedRequest = Request & {
    user: {
        username: string;
    };
};
export declare class ModelsController {
    private readonly modelsService;
    constructor(modelsService: ModelsService);
    create(payload: CreateModelDto, request: AuthenticatedRequest): Promise<import("../database/entities/model.entity").Model>;
    findAll(): Promise<import("../database/entities/model.entity").Model[]>;
    findOne(id: number): Promise<import("../database/entities/model.entity").Model>;
    update(id: number, payload: UpdateModelDto): Promise<import("../database/entities/model.entity").Model>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
export {};
