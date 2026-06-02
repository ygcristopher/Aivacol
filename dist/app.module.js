"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const redis_1 = __importDefault(require("@keyv/redis"));
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const brands_module_1 = require("./brands/brands.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const brand_entity_1 = require("./database/entities/brand.entity");
const model_entity_1 = require("./database/entities/model.entity");
const user_entity_1 = require("./database/entities/user.entity");
const vehicle_entity_1 = require("./database/entities/vehicle.entity");
const models_module_1 = require("./models/models.module");
const users_module_1 = require("./users/users.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mssql',
                    host: configService.getOrThrow('DB_HOST'),
                    port: Number(configService.get('DB_PORT', '1433')),
                    username: configService.getOrThrow('DB_USER'),
                    password: configService.getOrThrow('DB_PASSWORD'),
                    database: configService.getOrThrow('DB_NAME'),
                    entities: [user_entity_1.User, brand_entity_1.Brand, model_entity_1.Model, vehicle_entity_1.Vehicle],
                    options: {
                        encrypt: configService.get('DB_ENCRYPT', 'false') === 'true',
                        trustServerCertificate: configService.get('DB_TRUST_CERT', 'true') === 'true',
                    },
                    synchronize: false,
                    autoLoadEntities: false,
                }),
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const redisHost = configService.getOrThrow('REDIS_HOST');
                    const redisPort = Number(configService.get('REDIS_PORT', '6379'));
                    const redisTtl = Number(configService.get('CACHE_TTL', '60'));
                    return {
                        ttl: redisTtl,
                        stores: [new redis_1.default(`redis://${redisHost}:${redisPort}`)],
                    };
                },
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            brands_module_1.BrandsModule,
            models_module_1.ModelsModule,
            vehicles_module_1.VehiclesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map