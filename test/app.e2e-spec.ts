import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { Response } from 'supertest';
import { AppModule } from './../src/app.module';

type HealthResponse = {
  service: string;
  status: string;
  timestamp: string;
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((response: Response) => {
        const body = response.body as HealthResponse;
        expect(body.service).toBe('fleet-management-api');
        expect(body.status).toBe('ok');
        expect(body.timestamp).toBeDefined();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
