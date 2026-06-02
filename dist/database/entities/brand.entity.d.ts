import { AuditableEntity } from '../../common/entities/auditable.entity';
import { Model } from './model.entity';
export declare class Brand extends AuditableEntity {
    id: number;
    name: string;
    models: Model[];
}
