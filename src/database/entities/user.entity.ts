import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { AuditableEntity } from '../../common/entities/auditable.entity';

@Entity({ name: 'users' })
export class User extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('UQ_users_username', { unique: true })
  @Column({ type: 'nvarchar', length: 80 })
  username!: string;

  @Index('UQ_users_email', { unique: true })
  @Column({ type: 'nvarchar', length: 120 })
  email!: string;

  @Column({ name: 'password_hash', type: 'nvarchar', length: 255 })
  passwordHash!: string;
}
