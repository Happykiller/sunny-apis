import { describe, expect, it } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { ERRORS } from '@src/common/ERROR';
import { BddService } from '@service/db/db.service';
import { Inversify } from '@src/inversify/investify';
import { USER_ROLE } from '@presentation/guard/userRole';
import { LoggerService } from '@service/logger/logger.service';
import { GetUserUsecase } from '@usecase/user/get.user.usecase';
import { AuthPasskeyUsecase } from '@usecase/auth/passkey.auth.usecase';
import { PasswordLessService } from '@service/passwordless/passwordless.service';

describe('AuthPasskeyUsecase', () => {
  const mockInversify: MockProxy<Inversify> = mock<Inversify>();
  const mockBddService: MockProxy<BddService> = mock<BddService>();
  const mockLoggerService: MockProxy<LoggerService> = mock<LoggerService>();
  const mockGetUserUsecase: MockProxy<GetUserUsecase> = mock<GetUserUsecase>();
  const mockPasswordLessService: MockProxy<PasswordLessService> = mock<PasswordLessService>();

  mockInversify.bddService = mockBddService;
  mockInversify.loggerService = mockLoggerService;
  mockInversify.getUserUsecase = mockGetUserUsecase;
  mockInversify.passwordLessService = mockPasswordLessService;

  const usecase: AuthPasskeyUsecase = new AuthPasskeyUsecase(mockInversify);

  describe('#execute', () => {

    it('should build', () => {
      // arrange
      // act
      // assert
      expect(usecase).toBeDefined();
    });

    it('should get response of auth', async () => {
      // arrange
      const data = {
        id: '65d4d015261e894a1da31a65',
        code: 'faro',
        name_first: 'Fabrice',
        name_last: 'Rosito',
        description: 'Admin',
        mail: 'fabrice.rosito@gmail.com',
        role: 'USER',
      };
      mockGetUserUsecase.execute.mockResolvedValue({
        active: true,
        password: 'password',
        ...data,
        role: USER_ROLE.USER,
      });
      mockBddService.getPasskey.mockResolvedValue({
        id: '66098fdbf598ac342a811959',
        label: 'test',
        hostname: 'localhost',
        challenge: 'af54970f-9beb-423d-afd5-7f5a33b8d26f',
        registration: {
          authenticatorAttachment: 'platform',
          clientExtensionResults: {},
          id: '_6CMaiYtUhPWcEwOjiE3oeQ9u5I8HuGitu4wo1Mj9iY',
          rawId: '_6CMaiYtUhPWcEwOjiE3oeQ9u5I8HuGitu4wo1Mj9iY=',
          response: {
            attestationObject: 'o2NmbXRjdHBtZ2F0dFN0bXSmY2FsZzn__mNzaWdZAQAiL0psFMm76mmhBjtdLckMNFF2RXoYQM2IAUHc1v-PxaKKxjoXE6IfOBc5-Ui1px1QUOpoLEZ7LRxEAXt3grZwFz0sE_cXUfFYkbs7dciERoF0n48HEubIReOg9_a7ohsKVVuW_kdUxB4hqumYsOvA99VL3HJxOlPkbUhk7Y4lX6Fzuo4BUiZNEKsGSWR5u9_bz_HCt94TmiNnXskuN_hgSKr9GjvLCAYzaj_ndud8uEQK_aANLV896-TgE_VzP-I0L3BHzEkE1ULSElgjTM88FZMtjrxMF_zZa24QS3T1urWG9ks-rOOUOoiAYbo2-gg_8N4jqKAEHPGWA1zivqrwY3ZlcmMyLjBjeDVjglkFwzCCBb8wggOnoAMCAQICEFIi6VyAvEpouJpIUCKR8dwwDQYJKoZIhvcNAQELBQAwQTE_MD0GA1UEAxM2TkNVLUlGWC1LRVlJRC01RDA4MTU5NTFGNUY2MDYzOEE2OUU3MjUyRjNFQzRCRUNENzU1NEIyMB4XDTIyMDUwMTA4MzY0NVoXDTI3MDYwMzE3NTMwNlowADCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAI2PW1g0oSvAmgdhQzKlAWVQDqNeeFjXB8prytyyJacw4MYgseQH_OpUUi9bpjmwcEKUMGUMyOz_8nsACx9aw0x7Hrvc_R_W5tISIyl_GXg8lcELBJTW7qcu3Ia8eZh8iYNm7XK4ApRFqPdRCn_oHLyE0FgbjNQPPdaPHCUMicpsO61YChmVA8C01F3iIcGC6JyBTSBM9fsmSMV99PZks8Kd1PjDLxBUIef0IA7ImiF9F6vFj4gBawN-2kuDMQu-zxKcK-QoiWcSY_xnD2frQjTdo0-54aMwJUqsh93A2UqCS0VyGq6-8IUflhWr2Hx8q6JEUd7KWkOl0qpQqNEbfS8CAwEAAaOCAfIwggHuMA4GA1UdDwEB_wQEAwIHgDAMBgNVHRMBAf8EAjAAMG0GA1UdIAEB_wRjMGEwXwYJKwYBBAGCNxUfMFIwUAYIKwYBBQUHAgIwRB5CAFQAQwBQAEEAIAAgAFQAcgB1AHMAdABlAGQAIAAgAFAAbABhAHQAZgBvAHIAbQAgACAASQBkAGUAbgB0AGkAdAB5MBAGA1UdJQQJMAcGBWeBBQgDMFgGA1UdEQEB_wROMEykSjBIMRYwFAYFZ4EFAgEMC2lkOjQ5NDY1ODAwMRowGAYFZ4EFAgIMD1NMQiA5NjcwIFRQTTIuMDESMBAGBWeBBQIDDAdpZDowNzU1MB8GA1UdIwQYMBaAFNKey_kH178hHKgxdPpAVwWyg7IpMB0GA1UdDgQWBBRU0ZfdCxxGSLDHLlLfSYwYDywRRTCBsgYIKwYBBQUHAQEEgaUwgaIwgZ8GCCsGAQUFBzAChoGSaHR0cDovL2F6Y3Nwcm9kbmN1YWlrcHVibGlzaC5ibG9iLmNvcmUud2luZG93cy5uZXQvbmN1LWlmeC1rZXlpZC01ZDA4MTU5NTFmNWY2MDYzOGE2OWU3MjUyZjNlYzRiZWNkNzU1NGIyL2M3YmEyYWY5LTllNWYtNDc1ZC1iMDQ4LWMwNzNlMTFiNzQ4Ny5jZXIwDQYJKoZIhvcNAQELBQADggIBAALNUimIYxJ8lT4kV53WfPNqJ9w1zVDF0K_1aIf6DH5JaHpwC0nD33o8WKJixHVioilxTX0P5AXjBvx3uzJtnaKh3NHt_eij0pRruaOY47izTkNwLb6aeDZ09ptYPuhd4Y-vH6cAtz4Uol0OzGTLL1L1OrPtIAnyZKzNrNPct94ssYt_nxZWiGQczdPM6c40QWtE5p2L_2XAdHAnX0EopVrqaseBVhMcZ8n0UzX2CEM_LhebGvBjDrD2dnAz9ceOhz2ePPtyAddQPurVPNQHln1hwQXbWdMl0Y9T9N0OnffTs_V-I2z0kzKBSzYek7BL4Dc47eeeGx3SofNX9uAo08vCRxB4U6KD65v-6TC8BiGirFQyOeeu6BClwrXmdJ3GADRnLgsRG_aG16CiCH8W8JuveFWE8QbnEjgOWsvcey-amtC8n4fZaKsuE3TEGvhotsfvGBnQ9Domj01Vq7ZNm3sUcnCox9gOpfsCuzRSiAW0OVdUFn2ePG61E3VQve0_C2bJ9gCuPSYemHNMgLWuZSx_kCcQ3Tq70Wen9IyRSdNfcViy3Qh8R_T5jzgpVee4MNLS3O3L6m2etcZb_LmdqHnzQjyilqA-_qHQBKLewgWj3U-c5-l25V6eNdqsLNH2-Q8QYdrU4NBvLhh5AGzlhcFqPiOPXUvkvMBKl1PzYh_oWQbvMIIG6zCCBNOgAwIBAgITMwAABGSeHBYTaIaeXAAAAAAEZDANBgkqhkiG9w0BAQsFADCBjDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjE2MDQGA1UEAxMtTWljcm9zb2Z0IFRQTSBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eSAyMDE0MB4XDTIxMDYwMzE3NTMwNloXDTI3MDYwMzE3NTMwNlowQTE_MD0GA1UEAxM2TkNVLUlGWC1LRVlJRC01RDA4MTU5NTFGNUY2MDYzOEE2OUU3MjUyRjNFQzRCRUNENzU1NEIyMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEApx-d8IjI0sbhHroA23OTbXx4BkZvt-fpTeqQXUhbpzTMOHkxXVgk2HVSW6UMq2HTSmaP0u7PTcpoI-migSuEizYaFt0nHSlL9tZFWu7HVANIzcR4Wrjw7BwlDHAU5lyP9sFU5kT9C-uE7WI9W-vKlzLb_MkWbDV4t6uXykFCs2aL6GWwLQ6vI8Auj5vsZQReZkxZ3La19NUZfzRa_PNFvQsb6ykQBXrBDZpr4bY6rV1Mjh9PXuIangJRvJytVNl3u-Pi-tU8xlswciBcT4FqMibW9XjcjnhbDQ_xyINtxrPn-hG_0XOZem7OapgkzOyUPCvgEd4zSZSsjA2gF38_8ieq3aWNGAHjK1q45iNAewhge4fWTbRTrkyVqQrxb1G_ANR_ibE4Wl9sTlVj5fs8j-8rJ3TwVX53hsFe0XHvnmq7fXrMs0jE879IesFpNA5at7HgeU1nPbvKeJA3SovJQLeHhHHVEflO2cl6HsAprtaVKU25PnryAzuvyrgJ4gVqLFpm3lGlO3TVrfDZjvR0EIFSDJEH3KMG3GDw2r4-6jkiHAlp-bBu9tEEk_F2mRAw-4da2MqCJJF1MbvJLxwyIGODJnWSEE5v2n7iKjecDI2z-6JvzAWmUB03QYOAagH0nAwS7XtxyeQDRPN5N1UcPt_nqWANaz9-c61pH-_LCFcCAwEAAaOCAY4wggGKMA4GA1UdDwEB_wQEAwIChDAbBgNVHSUEFDASBgkrBgEEAYI3FSQGBWeBBQgDMBYGA1UdIAQPMA0wCwYJKwYBBAGCNxUfMBIGA1UdEwEB_wQIMAYBAf8CAQAwHQYDVR0OBBYEFNKey_kH178hHKgxdPpAVwWyg7IpMB8GA1UdIwQYMBaAFHqMCs4vSGIX4pTRrlXBUuxxdKRWMHAGA1UdHwRpMGcwZaBjoGGGX2h0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY3JsL01pY3Jvc29mdCUyMFRQTSUyMFJvb3QlMjBDZXJ0aWZpY2F0ZSUyMEF1dGhvcml0eSUyMDIwMTQuY3JsMH0GCCsGAQUFBwEBBHEwbzBtBggrBgEFBQcwAoZhaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9wcy9jZXJ0cy9NaWNyb3NvZnQlMjBUUE0lMjBSb290JTIwQ2VydGlmaWNhdGUlMjBBdXRob3JpdHklMjAyMDE0LmNydDANBgkqhkiG9w0BAQsFAAOCAgEAlMpHkJG3hhyx0gxFSQ8NaHEE3CWi1OoWtva_gmtAjG5sMh07yNxqIA3hSV0Xj6H85lI0SVMhBLhUixhefYDQ-n1UlSebHhQg-cOmw9zLfgqhYHXLOhWaWAto_7vB2A2j-nnAAPQl9NtAbyOoXDv5TCUlVEMGfZ0mQiGpNSvyVxZreXlxZUYCHWAxZanCEYGk9J0ucqgaYBq6c2EmWOjqJVp-HobnPQIyeMD8sZidcYihl3XjjjDmuLn2CnOs7oLJykZWOUGhkV3SlfZo3_AlhEkY4Oegyyoz28hfBZ5qCH-Bez2XqGMALVM1B2TlQawir4YdKESEOZM38VwGcPvKzWY1WGcIyCkvTAuN_RujVRF2PkAbU98h4azN3-LZSmkcv6zk4FIWc6Zr2K1HhO7mGLELbgJMpQz551EOuDGZ72ey8Eh5mnhaMqhliRE_jJyiP-HZ7IAYW7ZqNnK5Ww6t0hXMYnoxmYutv1Exm2mo48TFHBE5X7cg4g0EI_z9FPA0Q_cQmZxOTN7hJMtG-htah-6Pu8CfmfNN_LktAttf0P754fwWWAqDnicQ7c1PYp1B96KNefbzP3UkTCx6Kebm856sOPpYhoBsdjeG3RS6034QCm1XPzvo4BUHST0BoMX5xUOywv2zYBpMwLMHSmS1Pe2Dp40LTVBH9Pag0StdynxncHViQXJlYVh2ACMACwAEAHIAIJ3_y_NsODrmmfuYaNxty4nXFTiEvigDkiwSQVi_rSKuABAAEAADABAAIOam4F8uxH8_MtV6upCQvWv6HRwdmLYKBtn9sczV1lXyACCF_IyAyYNANDyJOMHYtJFl268a19RaKdTYopmvUcHF6GhjZXJ0SW5mb1ih_1RDR4AXACIAC5OLM18KjZyuEGerv1PYAD6o5vdTyZS-UwlDoQ_uqNrvABQGl_c2X81NrCMrOq4IhM19l2WSFAAAAAxmY0oED7vlDH5IXdcBoBEDNmCxQj0AIgALfCFVhJHyxigvJEao_G0aTSDDlSQC7K992gRpipxOyBUAIgAL49sB27KjLNpBKUyq1M8rjaYyMrgoAXlPH0XHza6J2aFoYXV0aERhdGFYpEmWDeWIDoxodDQXD2R2YFuP5K65ooYyx5lc87qDHZdjRQAAAAAImHBYytxLgbbhMN5Q3L6WACD_oIxqJi1SE9ZwTA6OITeh5D27kjwe4aK27jCjUyP2JqUBAgMmIAEhWCDmpuBfLsR_PzLVerqQkL1r-h0cHZi2CgbZ_bHM1dZV8iJYIIX8jIDJg0A0PIk4wdi0kWXbrxrX1Fop1Niima9RwcXo',
            authenticatorData: 'SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAAAiYcFjK3EuBtuEw3lDcvpYAIP-gjGomLVIT1nBMDo4hN6HkPbuSPB7horbuMKNTI_YmpQECAyYgASFYIOam4F8uxH8_MtV6upCQvWv6HRwdmLYKBtn9sczV1lXyIlgghfyMgMmDQDQ8iTjB2LSRZduvGtfUWinU2KKZr1HBxeg=',
            clientDataJSON: 'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiZWU2ZGY5MWItNmVkNC00YmYyLWIyNzUtN2YxNzhiMzg2ZjkwIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDo5MDAwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ==',
            publicKey: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE5qbgXy7Efz8y1Xq6kJC9a_odHB2YtgoG2f2xzNXWVfKF_IyAyYNANDyJOMHYtJFl268a19RaKdTYopmvUcHF6A==',
            publicKeyAlgorithm: -7,
            transports: [
              'internal'
            ]
          },
          type: 'public-key',
          user: {
            id: '90498c4b-30b7-4987-881c-e07409d45f7d',
            name: 'admin'
          }
        },
        registrationParsed: {
          authenticator: {
            aaguid: '08987058-cadc-4b81-b6e1-30de50dcbe96',
            counter: 0,
            icon_light: 'https://webauthn.passwordless.id/authenticators/08987058-cadc-4b81-b6e1-30de50dcbe96-light.png',
            icon_dark: 'https://webauthn.passwordless.id/authenticators/08987058-cadc-4b81-b6e1-30de50dcbe96-dark.png',
            name: 'Windows Hello'
          },
          credential: {
            id: '_6CMaiYtUhPWcEwOjiE3oeQ9u5I8HuGitu4wo1Mj9iY',
            publicKey: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE5qbgXy7Efz8y1Xq6kJC9a_odHB2YtgoG2f2xzNXWVfKF_IyAyYNANDyJOMHYtJFl268a19RaKdTYopmvUcHF6A==',
            algorithm: 'ES256',
            transports: [
              'internal'
            ]
          },
          synced: false,
          user: {
            id: '90498c4b-30b7-4987-881c-e07409d45f7d',
            name: 'admin',
            displayName: 'admin'
          },
          userVerified: true
        },
        user_id: '66098f1f7482c83a5764faa3',
        user_code: 'admin',
        active: true
      })
      mockPasswordLessService.verifyAuthentication.mockResolvedValue(null);
      // act
      const response = await usecase.execute({
        "user_code": "admin",
        "authentication": {
          "clientExtensionResults": {},
          "id": "47lw7m5bAXeJcA2H0-PR5woUxH60V_shvp5s3ulNOEk",
          "rawId": "47lw7m5bAXeJcA2H0-PR5woUxH60V_shvp5s3ulNOEk=",
          "type": "public-key",
          "authenticatorAttachment": "platform",
          "response": {
            "authenticatorData": "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAQ==",
            "clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiOTAyYjY0NTItZDVlZi00ZDRkLWE3Y2EtZDAxMWQ0ODQ3NTIwIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDo5MDAwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ==",
            "signature": "MEYCIQCFWoH_5nfNxVDTe_4EUo9Nxo_F60viCJs7kqFcwHPDIgIhALEYRzXXdjwc0nN_jG6lurPA6ueyReI9vybTuyF35JTW",
            "userHandle": "OTAyNjA3MjMtM2YzOC00YjQ0LThkNTMtODU3OTNiZDExZTcy"
          }
        }
      });
      // assert
      expect(response).toEqual(data);
    });

    it('should not found', async () => {
      // arrange
      mockGetUserUsecase.execute.mockRejectedValue(ERRORS.GET_USER_USECASE_USER_NOT_FOUND);
      // act
      let error;
      try {
        await usecase.execute({
          "user_code": "admin",
          "authentication": {
            "clientExtensionResults": {},
            "id": "47lw7m5bAXeJcA2H0-PR5woUxH60V_shvp5s3ulNOEk",
            "rawId": "47lw7m5bAXeJcA2H0-PR5woUxH60V_shvp5s3ulNOEk=",
            "type": "public-key",
            "authenticatorAttachment": "platform",
            "response": {
              "authenticatorData": "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAQ==",
              "clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiOTAyYjY0NTItZDVlZi00ZDRkLWE3Y2EtZDAxMWQ0ODQ3NTIwIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDo5MDAwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ==",
              "signature": "MEYCIQCFWoH_5nfNxVDTe_4EUo9Nxo_F60viCJs7kqFcwHPDIgIhALEYRzXXdjwc0nN_jG6lurPA6ueyReI9vybTuyF35JTW",
              "userHandle": "OTAyNjA3MjMtM2YzOC00YjQ0LThkNTMtODU3OTNiZDExZTcy"
            }
          }
        });
      } catch (e) {
        error = e.message;
      }
      // assert
      expect(error).toEqual(ERRORS.AUTH_PASSKEY_USECASE_FAIL);
    });

  });
});
