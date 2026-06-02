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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const typeorm_1 = require("typeorm");
const auditable_entity_1 = require("../../common/entities/auditable.entity");
const brand_entity_1 = require("./brand.entity");
const vehicle_entity_1 = require("./vehicle.entity");
let Model = class Model extends auditable_entity_1.AuditableEntity {
    id;
    name;
    brandId;
    brand;
    vehicles;
};
exports.Model = Model;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Model.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('UQ_models_name', { unique: true }),
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 120 }),
    __metadata("design:type", String)
], Model.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'brand_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Model.prototype, "brandId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => brand_entity_1.Brand, (brand) => brand.models, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'brand_id' }),
    __metadata("design:type", brand_entity_1.Brand)
], Model.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vehicle_entity_1.Vehicle, (vehicle) => vehicle.model),
    __metadata("design:type", Array)
], Model.prototype, "vehicles", void 0);
exports.Model = Model = __decorate([
    (0, typeorm_1.Entity)({ name: 'models' })
], Model);
//# sourceMappingURL=model.entity.js.map