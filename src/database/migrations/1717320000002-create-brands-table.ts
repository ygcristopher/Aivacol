import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBrandsTable1717320000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'brands',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'nvarchar',
            length: '100',
            isNullable: false,
            isUnique: true,
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
    await queryRunner.dropTable('brands', true);
  }
}
