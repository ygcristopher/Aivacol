import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';

import { Brand } from '../database/entities/brand.entity';
import { Model } from '../database/entities/model.entity';
import { ModelsService } from './models.service';

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

describe('ModelsService', () => {
  let service: ModelsService;
  let modelsRepo: MockRepository;
  let brandsRepo: MockRepository;

  beforeEach(async () => {
    modelsRepo = createMockRepository();
    brandsRepo = createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelsService,
        { provide: getRepositoryToken(Model), useValue: modelsRepo },
        { provide: getRepositoryToken(Brand), useValue: brandsRepo },
      ],
    }).compile();

    service = module.get<ModelsService>(ModelsService);
  });

  afterEach(() => jest.resetAllMocks());

  it('creates a model when brand exists', async () => {
    const brandId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const modelId = 'f47ac10b-58cc-4372-a567-0e02b2c3d480';
    brandsRepo.existsBy!.mockResolvedValue(true);
    const mockModel = { id: modelId, name: 'X', brandId };
    modelsRepo.create!.mockReturnValue(mockModel);
    modelsRepo.save!.mockResolvedValue(mockModel);

    const result = await service.create({ name: 'X', brandId }, 'me');

    expect(brandsRepo.existsBy).toHaveBeenCalledWith({ id: brandId });
    expect(modelsRepo.create).toHaveBeenCalled();
    expect(modelsRepo.save).toHaveBeenCalledWith(mockModel);
    expect(result).toEqual(mockModel);
  });

  it('throws when brand does not exist', async () => {
    const invalidBrandId = 'f47ac10b-58cc-4372-a567-0e02b2c3d999';
    brandsRepo.existsBy!.mockResolvedValue(false);

    await expect(
      service.create({ name: 'X', brandId: invalidBrandId }, 'me'),
    ).rejects.toThrow();
  });

  it('findAll returns models', async () => {
    const items = [{ id: 1 }];
    modelsRepo.find!.mockResolvedValue(items);

    const result = await service.findAll();
    expect(result).toBe(items);
  });
});
