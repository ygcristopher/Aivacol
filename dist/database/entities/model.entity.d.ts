import { AuditableEntity } from '../../common/entities/auditable.entity';
import { Brand } from './brand.entity';
import { Vehicle } from './vehicle.entity';
export declare class Model extends AuditableEntity {
    id: number;
    name: string;
    brandId: number | null;
    brand: Brand;
    vehicles: Vehicle[];
}
