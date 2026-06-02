import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditableEntity } from '../../common/entities/auditable.entity';
import { Brand } from './brand.entity';
import { Vehicle } from './vehicle.entity';

@Entity({ name: 'models' })
export class Model extends AuditableEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Index('UQ_models_name', { unique: true })
  @Column({ type: 'nvarchar', length: 120 })
  name!: string;

  @Column({ name: 'brand_id', type: 'int', nullable: true })
  brandId!: number | null;

  @ManyToOne(() => Brand, (brand) => brand.models, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand!: Brand;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.model)
  vehicles!: Vehicle[];
}
