import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditableEntity } from '../../common/entities/auditable.entity';
import { Model } from './model.entity';

@Entity({ name: 'brands' })
export class Brand extends AuditableEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Index('UQ_brands_name', { unique: true })
  @Column({ type: 'nvarchar', length: 100 })
  name!: string;

  @OneToMany(() => Model, (model) => model.brand)
  models!: Model[];
}
