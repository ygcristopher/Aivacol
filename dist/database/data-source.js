"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
const brand_entity_1 = require("./entities/brand.entity");
const model_entity_1 = require("./entities/model.entity");
const user_entity_1 = require("./entities/user.entity");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const appDataSource = new typeorm_1.DataSource({
    type: 'mssql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 1433),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [user_entity_1.User, brand_entity_1.Brand, model_entity_1.Model, vehicle_entity_1.Vehicle],
    migrations: ['src/database/migrations/*.ts'],
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    },
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
});
exports.default = appDataSource;
//# sourceMappingURL=data-source.js.map