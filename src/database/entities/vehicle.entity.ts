import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditableEntity } from '../../common/entities/auditable.entity';
import { Model } from './model.entity';

@Entity({ name: 'vehicles' })
export class Vehicle extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('UQ_vehicles_plate', { unique: true })
  @Column({ type: 'nvarchar', length: 10 })
  plate!: string;

  @Index('UQ_vehicles_chassis', { unique: true })
  @Column({ type: 'nvarchar', length: 30 })
  chassis!: string;

  @Index('UQ_vehicles_renavam', { unique: true })
  @Column({ type: 'nvarchar', length: 20 })
  renavam!: string;

  @Column({ name: 'year_manufacture', type: 'int' })
  yearManufacture!: number;

  @Column({ name: 'model_id', type: 'uuid' })
  modelId!: string;

  @ManyToOne(() => Model, (model) => model.vehicles, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'model_id' })
  model!: Model;
}
