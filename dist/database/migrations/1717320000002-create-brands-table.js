"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBrandsTable1717320000002 = void 0;
const typeorm_1 = require("typeorm");
class CreateBrandsTable1717320000002 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('brands', true);
    }
}
exports.CreateBrandsTable1717320000002 = CreateBrandsTable1717320000002;
//# sourceMappingURL=1717320000002-create-brands-table.js.map