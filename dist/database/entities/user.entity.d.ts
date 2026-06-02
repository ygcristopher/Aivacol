import { AuditableEntity } from '../../common/entities/auditable.entity';
export declare class User extends AuditableEntity {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
}
