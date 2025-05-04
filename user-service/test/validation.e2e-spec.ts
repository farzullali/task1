import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CustomValidationPipe } from '../src/common/pipes/validation.pipe';

describe('Validation (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new CustomValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should fail validation with missing fields', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('Validation Failed');
          expect(res.body.validationErrors).toBeDefined();
          expect(res.body.validationErrors.email).toBeDefined();
          expect(res.body.validationErrors.password).toBeDefined();
          expect(res.body.validationErrors.firstName).toBeDefined();
          expect(res.body.validationErrors.lastName).toBeDefined();
        });
    });

    it('should fail validation with invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe'
        })
        .expect(400)
        .expect(res => {
          expect(res.body.validationErrors.email).toBeDefined();
        });
    });

    it('should fail validation with weak password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'weak',
          firstName: 'John',
          lastName: 'Doe'
        })
        .expect(400)
        .expect(res => {
          expect(res.body.validationErrors.password).toBeDefined();
        });
    });

    it('should fail validation with extra fields', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
          extraField: 'should not be allowed'
        })
        .expect(400)
        .expect(res => {
          expect(res.body.validationErrors).toBeDefined();
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should fail validation with missing fields', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.body.validationErrors.email).toBeDefined();
          expect(res.body.validationErrors.password).toBeDefined();
        });
    });
  });
}); 