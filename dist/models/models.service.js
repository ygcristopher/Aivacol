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
exports.ModelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const brand_entity_1 = require("../database/entities/brand.entity");
const model_entity_1 = require("../database/entities/model.entity");
let ModelsService = class ModelsService {
    modelsRepository;
    brandsRepository;
    constructor(modelsRepository, brandsRepository) {
        this.modelsRepository = modelsRepository;
        this.brandsRepository = brandsRepository;
    }
    async create(payload, createdBy) {
        await this.ensureBrandExists(payload.brandId ?? null);
        const model = this.modelsRepository.create({
            name: payload.name.trim(),
            brandId: payload.brandId ?? null,
            createdBy,
        });
        try {
            return await this.modelsRepository.save(model);
        }
        catch (error) {
            this.handleDatabaseError(error, 'Model');
        }
    }
    findAll() {
        return this.modelsRepository.find({
            relations: { brand: true },
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        const model = await this.modelsRepository.findOne({
            where: { id },
            relations: { brand: true },
        });
        if (!model) {
            throw new common_1.NotFoundException('Model not found');
        }
        return model;
    }
    async update(id, payload) {
        const model = await this.modelsRepository.findOne({ where: { id } });
        if (!model) {
            throw new common_1.NotFoundException('Model not found');
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
        }
        catch (error) {
            this.handleDatabaseError(error, 'Model');
        }
    }
    async remove(id) {
        const model = await this.modelsRepository.findOne({ where: { id } });
        if (!model) {
            throw new common_1.NotFoundException('Model not found');
        }
        try {
            await this.modelsRepository.remove(model);
        }
        catch (error) {
            this.handleDatabaseError(error, 'Model');
        }
    }
    async ensureBrandExists(brandId) {
        if (brandId === null) {
            return;
        }
        const brandExists = await this.brandsRepository.existsBy({ id: brandId });
        if (!brandExists) {
            throw new common_1.NotFoundException('Brand not found');
        }
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
exports.ModelsService = ModelsService;
exports.ModelsService = ModelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(1, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ModelsService);
//# sourceMappingURL=models.service.js.map