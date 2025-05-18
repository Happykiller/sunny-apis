// src\graphql\hello\hello.e2e-spec.ts
import request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { ApolloDriver } from '@nestjs/apollo';
import { NestApplication } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { HelloModule } from './hello.module';
import { JwtStrategy } from '@graphql/auth/jwt.strategy';
import { AuthGuardModule } from '@graphql/guard/guard.module';
import { PasskeyModule } from '@graphql/passkey/passkey.module';

describe('HelloModule (e2e)', () => {
  let app: NestApplication;
  const token: string = jwt.sign(
    {
      id: '65d4d015261e894a1da31a64',
      code: 'ropo',
    },
    'secret',
    {
      expiresIn: '24h', // expires in 24 hours
    },
  );
  const authorization: string = 'Bearer ' + token;
  const mockConfig = {
      jwt: {
        secret: 'secret',
        refreshTokenName: 'sunny',
        signOptions: {
          expiresIn: '8h'
        }
      },
    };
    const mockInversify: MockProxy<any> = mock<any>();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: 'Inversify',
          useValue: mockInversify,
        },
        {
          provide: 'AppConfig',
          useValue: mockConfig,
        },
      ],
      imports: [
        AuthGuardModule.forRoot({
          appConfig: mockConfig,
          inversify: mockInversify,
        }),
        PasskeyModule.forRoot({
          inversify: mockInversify,
        }),
        HelloModule,
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          context: ({ req, res }) => {
            return { req, res };
          },
        }),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('#hello', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `query {
          hello {
            message
          }
        }`,
      })
      .set('Authorization', authorization)
      .expect(({ body }) => {
        const data = body.data.hello;
        expect(data).toEqual({
          message: 'Hello World',
        });
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
