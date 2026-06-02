"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersTable1717320000001 = void 0;
const typeorm_1 = require("typeorm");
class CreateUsersTable1717320000001 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
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
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('users', true);
    }
}
exports.CreateUsersTable1717320000001 = CreateUsersTable1717320000001;
//# sourceMappingURL=1717320000001-create-users-table.js.map