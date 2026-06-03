import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import type { Server } from 'http';

import { AppModule } from '../../src/app.module';

describe('Auth + Vehicles (integration)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer() as Server;
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  it('registers, logs in, creates model and vehicle', async () => {
    const username = `testuser${Date.now()}`;
    const password = 'Password123!';
    const email = `${username}@local.test`;

    // register
    await request(httpServer)
      .post('/auth/register')
      .send({ username, password, email })
      .expect(201);

    // login
    const login = await request(httpServer)
      .post('/auth/login')
      .send({ username, password })
      .expect(201);

    const token = (login.body as { access_token?: string }).access_token;
    expect(token).toBeDefined();

    // create brand
    const brandResp = await request(httpServer)
      .post('/brands')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `IntBrand${Date.now()}` })
      .expect(201);

    const brandId = (brandResp.body as { id?: number }).id;

    // create model
    const modelResp = await request(httpServer)
      .post('/models')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `IntModel${Date.now()}`, brandId })
      .expect(201);

    const modelId = (modelResp.body as { id?: number }).id;

    // create vehicle
    const vehicleResp = await request(httpServer)
      .post('/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plate: `AAA${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0')}`,
        chassis: `CH${Date.now()}`,
        renavam: `R${Date.now()}`,
        yearManufacture: 2020,
        modelId,
      })
      .expect(201);

    expect((vehicleResp.body as { id?: number }).id).toBeDefined();
  }, 20000);
});
