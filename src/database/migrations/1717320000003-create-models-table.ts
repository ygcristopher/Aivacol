import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateModelsTable1717320000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'models',
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
            length: '120',
            isNullable: false,
            isUnique: true,
          },
          { name: 'brand_id', type: 'int', isNullable: true },
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

    await queryRunner.createForeignKey(
      'models',
      new TableForeignKey({
        name: 'FK_models_brand_id',
        columnNames: ['brand_id'],
        referencedTableName: 'brands',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('models', 'FK_models_brand_id');
    await queryRunner.dropTable('models', true);
  }
}
