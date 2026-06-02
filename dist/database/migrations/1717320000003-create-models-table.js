"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateModelsTable1717320000003 = void 0;
const typeorm_1 = require("typeorm");
class CreateModelsTable1717320000003 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createForeignKey('models', new typeorm_1.TableForeignKey({
            name: 'FK_models_brand_id',
            columnNames: ['brand_id'],
            referencedTableName: 'brands',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey('models', 'FK_models_brand_id');
        await queryRunner.dropTable('models', true);
    }
}
exports.CreateModelsTable1717320000003 = CreateModelsTable1717320000003;
//# sourceMappingURL=1717320000003-create-models-table.js.map