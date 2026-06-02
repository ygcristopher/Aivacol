import { Request } from 'express';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';
type AuthenticatedRequest = Request & {
    user: {
        username: string;
    };
};
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(payload: CreateVehicleDto, request: AuthenticatedRequest): Promise<import("../database/entities/vehicle.entity").Vehicle>;
    findAll(): Promise<import("../database/entities/vehicle.entity").Vehicle[]>;
    findOne(id: number): Promise<import("../database/entities/vehicle.entity").Vehicle>;
    update(id: number, payload: UpdateVehicleDto): Promise<import("../database/entities/vehicle.entity").Vehicle>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
export {};
