import { AuditableEntity } from '../../common/entities/auditable.entity';
import { Model } from './model.entity';
export declare class Vehicle extends AuditableEntity {
    id: number;
    plate: string;
    chassis: string;
    renavam: string;
    yearManufacture: number;
    modelId: number;
    model: Model;
}
