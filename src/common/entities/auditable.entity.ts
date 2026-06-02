import { Column, UpdateDateColumn } from 'typeorm';

export abstract class AuditableEntity {
  @Column({
    name: 'created_at',
    type: 'datetime2',
    default: () => 'SYSDATETIME()',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime2',
    default: () => 'SYSDATETIME()',
  })
  updatedAt!: Date;

  @Column({ name: 'created_by', type: 'nvarchar', length: 100 })
  createdBy!: string;
}
