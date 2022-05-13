import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: []
    }).compile();

    configService = moduleFixture.get<ConfigService>(ConfigService);
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('/ (GET - Unauthenticated)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(401);
  });
  it('/ (GET - Authenticated)', () => {
    return request(app.getHttpServer())
      .get('/')
      .auth(configService.get<string>('HTTP_BASIC_USER'), configService.get<string>('HTTP_BASIC_PASS'), { type: 'basic' })
      .expect(200)
      .expect('Hello World!');
  });
});
