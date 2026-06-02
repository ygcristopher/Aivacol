"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVehiclesTable1717320000004 = void 0;
const typeorm_1 = require("typeorm");
class CreateVehiclesTable1717320000004 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createForeignKey('vehicles', new typeorm_1.TableForeignKey({
            name: 'FK_vehicles_model_id',
            columnNames: ['model_id'],
            referencedTableName: 'models',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey('vehicles', 'FK_vehicles_model_id');
        await queryRunner.dropTable('vehicles', true);
    }
}
exports.CreateVehiclesTable1717320000004 = CreateVehiclesTable1717320000004;
//# sourceMappingURL=1717320000004-create-vehicles-table.js.map