// src\services\passwordless\passwordless.service.fake.ts
import { AuthenticationInfo, AuthenticationJSON, CredentialInfo, RegistrationInfo, RegistrationJSON } from '@passwordless-id/webauthn/dist/esm/types';

import { PasswordLessService } from './passwordless.service';

export class PasswordLessServiceFake implements PasswordLessService {
  verifyRegistration(registrationJson: RegistrationJSON, expected: any): Promise<RegistrationInfo> {
    return Promise.resolve(null);
  }

  verifyAuthentication(authenticationJson: AuthenticationJSON, credential: CredentialInfo, expected: any): Promise<AuthenticationInfo> {
    return Promise.resolve(null);
  }
}
