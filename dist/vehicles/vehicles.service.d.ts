import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Model } from '../database/entities/model.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesService {
    private readonly vehiclesRepository;
    private readonly modelsRepository;
    private readonly cacheManager;
    private readonly vehiclesListCacheKey;
    constructor(vehiclesRepository: Repository<Vehicle>, modelsRepository: Repository<Model>, cacheManager: Cache);
    create(payload: CreateVehicleDto, createdBy: string): Promise<Vehicle>;
    findAll(): Promise<Vehicle[]>;
    findOne(id: number): Promise<Vehicle>;
    update(id: number, payload: UpdateVehicleDto): Promise<Vehicle>;
    remove(id: number): Promise<void>;
    private ensureModelExists;
    private normalizeVehiclePayload;
    private invalidateVehiclesListCache;
    private handleDatabaseError;
}
