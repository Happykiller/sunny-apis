import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { ApolloDriver } from '@nestjs/apollo';
import { NestApplication } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { config } from '@src/config';
import { USER_ROLE } from '@presentation/guard/userRole';
import { userRopo } from '@service/db/fake/mock/user.ropo';
import { UserModule } from '@presentation/user/user.module';
import { JwtStrategy } from '@presentation/auth/jwt.strategy';

describe('UserModule (e2e)', () => {
  let app: NestApplication;
  const token: string = jwt.sign(
    {
      id: userRopo.id,
      code: userRopo.code,
      role: USER_ROLE.USER,
    },
    config.jwt.secret,
    {
      expiresIn: '24h', // expires in 24 hours
    },
  );
  const authorization: string = 'Bearer ' + token;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
      imports: [
        UserModule,
        GraphQLModule.forRoot({
          autoSchemaFile: true,
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

  it('#users', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `query {
          users {
            id
            code
            name_first
            name_last
            description
            mail
            role
          }
        }`,
      })
      .set('Authorization', authorization)
      .expect(({ body }) => {
        const data = body.data.users;
        expect(data.length).toEqual(1);
      })
      .expect(200);
  });

  it('#user', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `query {
          user (
            dto: {
              id: "65d4d015261e894a1da31a64"
            }
          ) {
            id
            code
            name_first
            name_last
            description
            mail
            role
          }
        }`,
      })
      .set('Authorization', authorization)
      .expect(({ body }) => {
        const data = body.data.user;
        expect(data.id).toBeDefined();
      })
      .expect(200);
  });

  it('#create_user', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `mutation {
          create_user (
            dto: {
              code: "faro"
              password: "password"
              name_first: "fabrice"
              name_last: "rosito"
              description: "description"
              mail: "fabrice.rosito@gmail.com"
            }
          ) {
            id
            code
            name_first
            name_last
            description
            mail
            role
          }
        }`,
      })
      .set('Authorization', authorization)
      .expect(({ body }) => {
        const data = body.data.create_user;
        expect(data.id).toBeDefined();
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
