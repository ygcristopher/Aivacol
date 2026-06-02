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
exports.Vehicle = void 0;
const typeorm_1 = require("typeorm");
const auditable_entity_1 = require("../../common/entities/auditable.entity");
const model_entity_1 = require("./model.entity");
let Vehicle = class Vehicle extends auditable_entity_1.AuditableEntity {
    id;
    plate;
    chassis;
    renavam;
    yearManufacture;
    modelId;
    model;
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('UQ_vehicles_plate', { unique: true }),
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 10 }),
    __metadata("design:type", String)
], Vehicle.prototype, "plate", void 0);
__decorate([
    (0, typeorm_1.Index)('UQ_vehicles_chassis', { unique: true }),
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 30 }),
    __metadata("design:type", String)
], Vehicle.prototype, "chassis", void 0);
__decorate([
    (0, typeorm_1.Index)('UQ_vehicles_renavam', { unique: true }),
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 20 }),
    __metadata("design:type", String)
], Vehicle.prototype, "renavam", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'year_manufacture', type: 'int' }),
    __metadata("design:type", Number)
], Vehicle.prototype, "yearManufacture", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'model_id', type: 'int' }),
    __metadata("design:type", Number)
], Vehicle.prototype, "modelId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => model_entity_1.Model, (model) => model.vehicles, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'model_id' }),
    __metadata("design:type", model_entity_1.Model)
], Vehicle.prototype, "model", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)({ name: 'vehicles' })
], Vehicle);
//# sourceMappingURL=vehicle.entity.js.map