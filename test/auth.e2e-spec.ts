import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handle register', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Pangop',
        email: 'pangop3@email.com',
        password: 'password',
      })
      .expect(201) //ini 201 karena pasti kalau kita create itu pingnya 201
      .then(({ body }: request.Response) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBe('Pangop');
        expect(body.email).toBe('pangop3@email.com');
      });
  });
});
