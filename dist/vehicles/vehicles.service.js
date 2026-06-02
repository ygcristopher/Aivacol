"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const model_entity_1 = require("../database/entities/model.entity");
const vehicle_entity_1 = require("../database/entities/vehicle.entity");
let VehiclesService = class VehiclesService {
    vehiclesRepository;
    modelsRepository;
    cacheManager;
    vehiclesListCacheKey = 'vehicles:list:v1';
    constructor(vehiclesRepository, modelsRepository, cacheManager) {
        this.vehiclesRepository = vehiclesRepository;
        this.modelsRepository = modelsRepository;
        this.cacheManager = cacheManager;
    }
    async create(payload, createdBy) {
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
            return savedVehicle;
        }
        catch (error) {
            this.handleDatabaseError(error, 'Vehicle');
        }
    }
    async findAll() {
        const cachedVehicles = await this.cacheManager.get(this.vehiclesListCacheKey);
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
    async findOne(id) {
        const vehicle = await this.vehiclesRepository.findOne({
            where: { id },
            relations: {
                model: {
                    brand: true,
                },
            },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        return vehicle;
    }
    async update(id, payload) {
        const vehicle = await this.vehiclesRepository.findOne({ where: { id } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
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
            return updatedVehicle;
        }
        catch (error) {
            this.handleDatabaseError(error, 'Vehicle');
        }
    }
    async remove(id) {
        const vehicle = await this.vehiclesRepository.findOne({ where: { id } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        try {
            await this.vehiclesRepository.remove(vehicle);
            await this.invalidateVehiclesListCache();
        }
        catch (error) {
            this.handleDatabaseError(error, 'Vehicle');
        }
    }
    async ensureModelExists(modelId) {
        const modelExists = await this.modelsRepository.existsBy({ id: modelId });
        if (!modelExists) {
            throw new common_1.NotFoundException('Model not found');
        }
    }
    normalizeVehiclePayload(payload) {
        return {
            plate: payload.plate?.trim().toUpperCase(),
            chassis: payload.chassis?.trim().toUpperCase(),
            renavam: payload.renavam?.trim(),
        };
    }
    async invalidateVehiclesListCache() {
        await this.cacheManager.del(this.vehiclesListCacheKey);
    }
    handleDatabaseError(error, entityName) {
        if (error instanceof typeorm_2.QueryFailedError) {
            const driverError = error.driverError;
            if (driverError.number === 2601 || driverError.number === 2627) {
                throw new common_1.ConflictException(`${entityName} already exists`);
            }
            if (driverError.number === 547) {
                throw new common_1.ConflictException(`${entityName} cannot be removed because it is in use`);
            }
        }
        throw new common_1.InternalServerErrorException('Unexpected database error');
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map