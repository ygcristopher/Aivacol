import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateVehiclesTable1717320000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vehicles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'plate',
            type: 'nvarchar',
            length: '10',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'chassis',
            type: 'nvarchar',
            length: '30',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'renavam',
            type: 'nvarchar',
            length: '20',
            isNullable: false,
            isUnique: true,
          },
          { name: 'year_manufacture', type: 'int', isNullable: false },
          { name: 'model_id', type: 'int', isNullable: false },
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
      'vehicles',
      new TableForeignKey({
        name: 'FK_vehicles_model_id',
        columnNames: ['model_id'],
        referencedTableName: 'models',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('vehicles', 'FK_vehicles_model_id');
    await queryRunner.dropTable('vehicles', true);
  }
}
