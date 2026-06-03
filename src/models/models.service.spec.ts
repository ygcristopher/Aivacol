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
    brandsRepo.existsBy!.mockResolvedValue(true);
    const mockModel = { id: 1, name: 'X', brandId: 2 };
    modelsRepo.create!.mockReturnValue(mockModel);
    modelsRepo.save!.mockResolvedValue(mockModel);

    const result = await service.create({ name: 'X', brandId: 2 }, 'me');

    expect(brandsRepo.existsBy).toHaveBeenCalledWith({ id: 2 });
    expect(modelsRepo.create).toHaveBeenCalled();
    expect(modelsRepo.save).toHaveBeenCalledWith(mockModel);
    expect(result).toEqual(mockModel);
  });

  it('throws when brand does not exist', async () => {
    brandsRepo.existsBy!.mockResolvedValue(false);

    await expect(
      service.create({ name: 'X', brandId: 99 }, 'me'),
    ).rejects.toThrow();
  });

  it('findAll returns models', async () => {
    const items = [{ id: 1 }];
    modelsRepo.find!.mockResolvedValue(items);

    const result = await service.findAll();
    expect(result).toBe(items);
  });
});
