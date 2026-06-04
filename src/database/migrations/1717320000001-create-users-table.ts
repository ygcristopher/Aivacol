import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1717320000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'NEWSEQUENTIALID()',
          },
          {
            name: 'username',
            type: 'nvarchar',
            length: '80',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'email',
            type: 'nvarchar',
            length: '120',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'nvarchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime2',
            default: 'SYSDATETIME()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'datetime2',
            default: 'SYSDATETIME()',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'nvarchar',
            length: '100',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}
