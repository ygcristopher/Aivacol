import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository, ObjectLiteral } from 'typeorm';

import { Model } from '../database/entities/model.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { VehiclesService } from './vehicles.service';
import { RabbitmqService } from '../messaging/rabbitmq.service';
import { AuditService } from '../audit/audit.service';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  existsBy: jest.fn(),
});

const createMockCache = () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
});

const createMockRabbit = () => ({ publish: jest.fn() });
const createMockAudit = () => ({ record: jest.fn() });

describe('VehiclesService', () => {
  let service: VehiclesService;
  let vehiclesRepo: MockRepository;
  let modelsRepo: MockRepository;
  let cache: ReturnType<typeof createMockCache>;
  let rabbitMock: ReturnType<typeof createMockRabbit>;
  let auditMock: ReturnType<typeof createMockAudit>;

  beforeEach(async () => {
    vehiclesRepo = createMockRepository();
    modelsRepo = createMockRepository();
    cache = createMockCache();
    const rabbit = createMockRabbit();
    const audit = createMockAudit();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: getRepositoryToken(Vehicle), useValue: vehiclesRepo },
        { provide: getRepositoryToken(Model), useValue: modelsRepo },
        { provide: CACHE_MANAGER, useValue: cache },
        { provide: RabbitmqService, useValue: rabbit },
        { provide: AuditService, useValue: audit },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    rabbitMock = module.get<RabbitmqService>(
      RabbitmqService,
    ) as unknown as ReturnType<typeof createMockRabbit>;
    auditMock = module.get<AuditService>(AuditService) as unknown as ReturnType<
      typeof createMockAudit
    >;
  });

  afterEach(() => jest.resetAllMocks());

  it('creates a vehicle when model exists and invalidates cache', async () => {
    const modelId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const vehicleId = 'f47ac10b-58cc-4372-a567-0e02b2c3d480';
    modelsRepo.existsBy!.mockResolvedValue(true);
    const payload = {
      plate: 'ABC1234',
      chassis: 'CHASSIS1',
      renavam: 'RENAVAM1',
      yearManufacture: 2020,
      modelId,
    };
    const created = { id: vehicleId, ...payload };
    vehiclesRepo.create!.mockReturnValue(created);
    vehiclesRepo.save!.mockResolvedValue(created);

    const result = await service.create(payload, 'me');

    expect(modelsRepo.existsBy).toHaveBeenCalledWith({ id: modelId });
    expect(vehiclesRepo.save).toHaveBeenCalledWith(created);
    expect(cache.del).toHaveBeenCalled();
    expect(result).toEqual(created);
    // verify publish and audit called
    const rabbit = rabbitMock;
    const audit = auditMock;
    expect(rabbit.publish).toHaveBeenCalledWith(
      'vehicle.created',
      expect.any(Object),
    );
    expect(audit.record).toHaveBeenCalledWith(
      'vehicle.created',
      expect.any(Object),
    );
  });

  it('updates a vehicle and publishes audit', async () => {
    const vehicleId = 'f47ac10b-58cc-4372-a567-0e02b2c3d481';
    const modelId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const existing = { id: vehicleId, plate: 'OLD', modelId } as Vehicle;
    vehiclesRepo.findOne!.mockResolvedValue(existing);
    const saved = { ...existing, plate: 'NEW' };
    vehiclesRepo.save!.mockResolvedValue(saved);

    const result = await service.update(vehicleId, { plate: 'NEW' });

    expect(result).toEqual(saved);
    const rabbit = rabbitMock;
    const audit = auditMock;
    expect(rabbit.publish).toHaveBeenCalledWith(
      'vehicle.updated',
      expect.any(Object),
    );
    expect(audit.record).toHaveBeenCalledWith(
      'vehicle.updated',
      expect.any(Object),
    );
  });

  it('removes a vehicle and publishes audit', async () => {
    const vehicleId = 'f47ac10b-58cc-4372-a567-0e02b2c3d482';
    const existing = { id: vehicleId } as Vehicle;
    vehiclesRepo.findOne!.mockResolvedValue(existing);
    vehiclesRepo.remove!.mockResolvedValue(undefined as any);

    await service.remove(vehicleId);

    const rabbit = rabbitMock;
    const audit = auditMock;
    expect(rabbit.publish).toHaveBeenCalledWith(
      'vehicle.removed',
      expect.any(Object),
    );
    expect(audit.record).toHaveBeenCalledWith(
      'vehicle.removed',
      expect.any(Object),
    );
  });
});
