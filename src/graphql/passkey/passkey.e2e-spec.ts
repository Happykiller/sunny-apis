// src\graphql\passkey\passkey.e2e-spec.ts
import request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { ApolloDriver } from '@nestjs/apollo';
import { NestApplication } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { USER_ROLE } from '@graphql/guard/userRole';
import { JwtStrategy } from '@graphql/auth/jwt.strategy';
import { userRopo } from '@services/db/fake/mock/user.ropo';
import { AuthGuardModule } from '@graphql/guard/guard.module';
import { PasskeyModule } from '@graphql/passkey/passkey.module';
import { configureAuthGuardFactory } from '@graphql/guard/auth.guard.factory';

describe('PasskeyModule (e2e)', () => {
  let app: NestApplication;
  const token: string = jwt.sign(
    {
      id: userRopo.id,
      code: userRopo.code,
      role: USER_ROLE.USER,
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

  mockInversify.createPasskeyUsecase = {
    execute: jest.fn().mockResolvedValue({
      id: 'mock-passkey-id',
      label: 'test',
      user_id: userRopo.id,
      hostname: 'localhost',
      user_code: userRopo.code,
      challenge: 'af54970f-9beb-423d-afd5-7f5a33b8d26f',
      registration: {
        id: 'z2pSR6VMiBixHcexvvSFO1brtXEvu7JvlLagedVbecs',
      },
    }),
  };

  mockInversify.getUserUsecase = {
    execute: jest.fn().mockResolvedValue(
      {
        id: userRopo.id,
        code: userRopo.code,
        role: userRopo.role,
        active: true
      },
    ),
  };

  mockInversify.getByUserIdPasskeyUsecase = {
    execute: jest.fn().mockResolvedValue([
      {
        id: 'mock-passkey-id',
        label: 'test',
        user_id: userRopo.id,
        hostname: 'localhost',
        user_code: userRopo.code,
        challenge: 'af54970f-9beb-423d-afd5-7f5a33b8d26f',
        registration: {
          id: 'z2pSR6VMiBixHcexvvSFO1brtXEvu7JvlLagedVbecs',
        },
      },
    ]),
  };

  mockInversify.deletePasskeyUsecase = {
    execute: jest.fn().mockResolvedValue(undefined),
  };

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
    configureAuthGuardFactory({
      appConfig: mockConfig,
      inversify: mockInversify,
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('#create_passkey', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `mutation {
          create_passkey (
            dto: {
              label: "test_vergo_local"
              challenge: "d471bb4b-10c2-42e3-8312-e4f7de91b793"
              hostname: "localhost"
              registration: {
                type: "public-key"
                id: "GyxR_akn506c0B6bxMppXUrpM9lkT-DYoAGMYfrMJxM"
                rawId: "GyxR_akn506c0B6bxMppXUrpM9lkT-DYoAGMYfrMJxM="
                authenticatorAttachment: "platform"
                response: {
                  attestationObject: "o2NmbXRjdHBtZ2F0dFN0bXSmY2FsZzn__mNzaWdZAQBL9gev44qGR3XrKj0qo_mvaGP1q9-51EQ9KuEhjinmtxvfnrEwalKSU9QOrqMiG96pijjazGD1JYm7Dzsm7gnzv0QhlQvj5aQHp8t_uKzx4DXhFlZPSwNcR1OilJsoNDpLdAPdsk4Zzx8KvnCDh46HvSSNcOXG0EU4Hvy_XO5bDSnVyeEuY_OCtFbjvgtvRRC-5c1Uyfe2G0fP2YZ6AWIr-NNkJOJctbpvokqe0BgLL2EfBj1nzB1ycH23AaW7LjOTp0PB_JVFLnMqbESIexgjbYgGHOo8vF9DOJ0Lex_Ey5rZuNdtvV4IsE92xfow224oQNrV-4SOe8eubsikJD87Y3ZlcmMyLjBjeDVjglkFvTCCBbkwggOhoAMCAQICEFueDi_-Xk_ms1i7Bi7PWokwDQYJKoZIhvcNAQELBQAwQjFAMD4GA1UEAxM3RVVTLUlOVEMtS0VZSUQtMzQyMTlCMjFGNDc3RjZDN0Y3OEEwRjI2QjIzRDA0MzBERUVBNDM2MzAeFw0yNDAyMTcwNzM2MTVaFw0yNzA3MTUxNzQ2MzBaMAAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDP92CIr-Ow4lyCtY2Mj2VEN2Q6TbJ46v6Oiep8WbVBcd0Kb0cBG7uMFTJ28BN8CNwNfuAhl_ttv3rll6KKKXrUHJIunthcB4tNfQXDcx1BdQ8HH-YE0x1W__02QFZJf_zKLlhxsXtkgr9JpYlWczkppnixCKkoSBurPYkuPhC4IJQ0RIXRay6WKUJJKTl1MLy1hBFwXD-8bi1ZdXHWmqOYnfxBzloyTY_31tPd2A28S6RIBWM-CW7ZgyNJS3WrZ7VR55N1MS6qcJ62GPmNuHhhRr1T4oTtm4wit1DvAVgYLr3gd55p9LNRnX2xvUvAqD3IrYPvZx1zbQL07uZgJbClAgMBAAGjggHrMIIB5zAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH_BAIwADBtBgNVHSABAf8EYzBhMF8GCSsGAQQBgjcVHzBSMFAGCCsGAQUFBwICMEQeQgBUAEMAUABBACAAIABUAHIAdQBzAHQAZQBkACAAIABQAGwAYQB0AGYAbwByAG0AIAAgAEkAZABlAG4AdABpAHQAeTAQBgNVHSUECTAHBgVngQUIAzBQBgNVHREBAf8ERjBEpEIwQDEWMBQGBWeBBQIBDAtpZDo0OTRFNTQ0MzEOMAwGBWeBBQICDANBREwxFjAUBgVngQUCAwwLaWQ6MDI1ODAwMTIwHwYDVR0jBBgwFoAUNAENcC6kckA61qSw-k7XmqzK8UkwHQYDVR0OBBYEFLVLffJIdEAhsd3RV2SvAlxDhQ5IMIGzBggrBgEFBQcBAQSBpjCBozCBoAYIKwYBBQUHMAKGgZNodHRwOi8vYXpjc3Byb2RldXNhaWtwdWJsaXNoLmJsb2IuY29yZS53aW5kb3dzLm5ldC9ldXMtaW50Yy1rZXlpZC0zNDIxOWIyMWY0NzdmNmM3Zjc4YTBmMjZiMjNkMDQzMGRlZWE0MzYzLzkxZmQ3NDUwLWQ3YjAtNDcxMS1hZjJhLWUzODAwOTE4YjBlOS5jZXIwDQYJKoZIhvcNAQELBQADggIBAGW1XzznuD-DvcKzGnQhVLqnD7IElSlQc0kPo1yloViK6yetUINHlnQIaQHMM6QmKibwHofSbYcMWPjV0q1VJq4LYerFi0brQudMENIDOzQXaEkWhzvD7r1ayKhNBobWREbDBh5SLEARJQXdyciNZdaRqX_5Q6pgN72eXD8Z9dHFPPBgAho2e3iabxki36Q6rkCUEaXjhWq1aBDouUtDeGoMkjQ_nYMKzM40YS_07cv9U2k5laNXFSJe241-EnIVUk7vEmT_0r88ksrBNTMDPkhIHQcSGe3-N48Ydwnmtf0eM2jAgSeajnNripnSI7qbdKWv-nJLJAPQ_wmawU3eZ5hGqJ6HjD0fleu7f_xUpsVd14bc6blbJvzFYFZ0-UrRmDkz-HKS3c5HzKzcLw_suPNbG3ObntuuX0mc_Jg6L1KINLhNWSIJoVtECTn2Xid0MFxDYcO_FjQ9lzjJ4ocwjnGkOtn0gEtf4GWcbam7USVmbXiWJawc9UEN744skllkCokQKDIiNHYTA1pTCjaWsFy9e0-oqu1MWWpSpdDp-yw1TUTQBVhTO-_Gk-3YpnWi9A-AwKlgoWWSw2Ou3BfLTxdlBe6FdXtVryedw-4DVBMd59Td9-M2CNFj1zt-nD4rZzV-uERqzLPFNrxvhE6ZEEVhyfowy5e16TA7OOUp8EDUWQbwMIIG7DCCBNSgAwIBAgITMwAABxYgXHHGr1bDtwAAAAAHFjANBgkqhkiG9w0BAQsFADCBjDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjE2MDQGA1UEAxMtTWljcm9zb2Z0IFRQTSBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eSAyMDE0MB4XDTIxMDcxNTE3NDYzMFoXDTI3MDcxNTE3NDYzMFowQjFAMD4GA1UEAxM3RVVTLUlOVEMtS0VZSUQtMzQyMTlCMjFGNDc3RjZDN0Y3OEEwRjI2QjIzRDA0MzBERUVBNDM2MzCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAMPEHn5IKWnqPi7jX6ZxodigyK4wbpN6fi4RFjfYQ9tWooHTNl770aUVKcNQVlroiiVT76McSpB2M_Ntr9nrfSFKJi8HnXgg3pAVOZgv_vWZBmH4wRwufugcPDBDyaTVe3YWBbIydPOtAnyOUOQwUbg5_QLHZgQKAuhjX2rNnZbh7ztanSLT3rFGafZ4BhKI28QlRlKfSwiA4IsPE0BzIKJuHz6MG8HU5A24KPnYnsIaXzLc5rFcrx6tSt361nc8Ukoe0gsDKDTo2gQFwBkiEvWdXh_3H6GsO46lUfNb0mN6Emii7VSh-miGmDumC3P3qZWotySLTEQJDT2bEFBC_sMs1Z_2sQoyBe3NZDjlDPp98_bpY4JQq1Ir19E0MHDq79V3aSGuwZdVBRBp31r1qf8STC9hjK679ChtAs7GNGynntgIxF9hErzDpz98V_GEIcZNiqQrp-26SEnMA_KZNT0xE-Frc4LPUnMmLv5RXEKpmi77UCECwI7PHbAQ9eyTJWanq2Fn9LssXIioTHGWU61pl6YyM_j2mQBmV2v4Unz-nm6uH3ElpaaKVkukms6IZPjBGYdqygH7RN_w4iPNw7coUQJ_J5mVqTtXXbZJiewgkXHwAS-VIz1RkGA298RpxrV2KqJ2zj2SJjtox50YzZqV6U2R2yVyq4Qfd5BNXg8hAgMBAAGjggGOMIIBijAOBgNVHQ8BAf8EBAMCAoQwGwYDVR0lBBQwEgYJKwYBBAGCNxUkBgVngQUIAzAWBgNVHSAEDzANMAsGCSsGAQQBgjcVHzASBgNVHRMBAf8ECDAGAQH_AgEAMB0GA1UdDgQWBBQ0AQ1wLqRyQDrWpLD6TtearMrxSTAfBgNVHSMEGDAWgBR6jArOL0hiF-KU0a5VwVLscXSkVjBwBgNVHR8EaTBnMGWgY6Bhhl9odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NybC9NaWNyb3NvZnQlMjBUUE0lMjBSb290JTIwQ2VydGlmaWNhdGUlMjBBdXRob3JpdHklMjAyMDE0LmNybDB9BggrBgEFBQcBAQRxMG8wbQYIKwYBBQUHMAKGYWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY2VydHMvTWljcm9zb2Z0JTIwVFBNJTIwUm9vdCUyMENlcnRpZmljYXRlJTIwQXV0aG9yaXR5JTIwMjAxNC5jcnQwDQYJKoZIhvcNAQELBQADggIBAGTbDe45LJIux6HyDXDySAfzdtcvv8XywrCrz1J3ArtoJInkeBXstExTCcO4mYV4DnqSBnkgF-iP38s0TWNUxmxvx00YoPLSDza-GcHj0-Dbu2nnC_49DkRCG3ZUufDIGMVKva-X9pDcQ1NpXtrbMfxj9ZbeU3Ge0rSfj-bZixxsfh73dIRnmuDccRqsa5NczFKRf0YAqP2P3220uqTCcywuGmMvs9-DF5Adc0S48YwcK-4PrIW3RKunVkfBBhVSlL29X0mvWE-eBlNBlAYYBy_kmlXTPNOH1UymUTuQ0DSuc8zYH6ZP-xBqWGkcsRBJmS4WqgQXK9Tx0SdUAWvkdaWilOiAJzAy3SHsh2xV1HSakBzuFxcNbtgVkrkU-6XGEhAjDqy2C1iUsqdb5WacS1PC61JJCh4FKkWE88AoxCSkrWYOA0EhJd4fTwFcy8julr6xrkc-uQl46C-xeaaJ89NIww1fFujfEyP6x-0I_ap8oVA3_e4uPhmRIpDDBw6mnucV8fzZOZ2moxmRErk9LYbG-5U16BuGvRNklsYY5KkT0SYNTYkod0clGfcz8pn7Shmj_SwKBfLfkR_iZGlazXwMlvEYrLx5GSJ-0MelMP8KTM33QVpduDWL_4F8viqQHbwAk5eCKorubVzuvBA1tcoS7TjCfCHqupr5AOoPr3vYZ3B1YkFyZWFYdgAjAAsABAByACCd_8vzbDg65pn7mGjcbcuJ1xU4hL4oA5IsEkFYv60irgAQABAAAwAQACAxp7Rm3XJoB3ia-P86M7fQH_Q77yr8khUrClqnOX8gBAAgWGZ_kzXOEUriq806sYuCkTC6bXpl_nGtgrHr1oh4CGFoY2VydEluZm9Yof9UQ0eAFwAiAAvpAYXU5JrBYgz9vmRp4r8HJr8b791vU85yuIy6WzEvGQAUIXaxGhLcj3v-9oE9xRcgxjYbDZIAAAACRUsQnD3I7zMuY-j2Ach5LuH0kwHdACIAC4Mp7UUc_7xPFOWseESwfe-JVyeAtovXR7muwEOZGL_GACIAC7l97SAM8Z3U2-SwVEx0EYaIRV6Ap4rqAgyPKpUGXf0JaGF1dGhEYXRhWKRJlg3liA6MaHQ0Fw9kdmBbj-SuuaKGMseZXPO6gx2XY0UAAAAACJhwWMrcS4G24TDeUNy-lgAgGyxR_akn506c0B6bxMppXUrpM9lkT-DYoAGMYfrMJxOlAQIDJiABIVggMae0Zt1yaAd4mvj_OjO30B_0O-8q_JIVKwpapzl_IAQiWCBYZn-TNc4RSuKrzTqxi4KRMLptemX-ca2CsevWiHgIYQ=="
                  authenticatorData: "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAAAiYcFjK3EuBtuEw3lDcvpYAIBssUf2pJ-dOnNAem8TKaV1K6TPZZE_g2KABjGH6zCcTpQECAyYgASFYIDGntGbdcmgHeJr4_zozt9Af9DvvKvySFSsKWqc5fyAEIlggWGZ_kzXOEUriq806sYuCkTC6bXpl_nGtgrHr1oh4CGE="
                  clientDataJSON: "eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiZDQ3MWJiNGItMTBjMi00MmUzLTgzMTItZTRmN2RlOTFiNzkzIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDo5MDAwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ=="
                  publicKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEMae0Zt1yaAd4mvj_OjO30B_0O-8q_JIVKwpapzl_IARYZn-TNc4RSuKrzTqxi4KRMLptemX-ca2CsevWiHgIYQ=="
                  publicKeyAlgorithm: -7
                  transports: [
                    "internal"
                  ]
                },
                user: {
                  name: "admin (test_vergo_local - 20250508T13283)"
                  id: "65932666-a693-4f1d-bb6f-e844e5f7aa7a"
                }
              }
            }
          ) {
            id
            label
            user_id
            hostname
            user_code
            challenge
            credential_id
          }
        }`,
      })
      .set('authorization', authorization)
      .expect(({ body }) => {
        const data = body.data.create_passkey;
        expect(data.id).toBeDefined();
      })
      .expect(200);
  });

  it('#passkeys_for_user', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `query {
          passkeys_for_user {
            id
            label
            user_id
            hostname
            user_code
            challenge
            credential_id
          }
        }`,
      })
      .set('Authorization', authorization)
      .expect(({ body }) => {
        const data = body.data.passkeys_for_user;
        expect(data[0].id).toBeDefined();
      })
      .expect(200);
  });

  it('#delete_passkey', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `mutation {
          delete_passkey (
            dto: {
              passkey_id: "6607bc84d339c751cadc7694"
            }
          )
        }`,
      })
      .set('Authorization', authorization)
      .expect(({ body }) => {
        const data = body.data.delete_passkey;
        expect(data).toBeTruthy();
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
