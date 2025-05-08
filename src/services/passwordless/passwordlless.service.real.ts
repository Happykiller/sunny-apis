// src\services\passwordless\passwordlless.service.real.ts
import { server } from '@passwordless-id/webauthn';
import { AuthenticationInfo, AuthenticationJSON, CredentialInfo, RegistrationInfo, RegistrationJSON } from '@passwordless-id/webauthn/dist/esm/types';

import { PasswordLessService } from './passwordless.service';

export class PasswordLessServiceReal implements PasswordLessService {
  verifyRegistration(registrationJson: RegistrationJSON, expected: any): Promise<RegistrationInfo> {
    return server.verifyRegistration(registrationJson, expected);
  }
  
  verifyAuthentication(authenticationJson: AuthenticationJSON, credential: CredentialInfo, expected: any): Promise<AuthenticationInfo> {
    return server.verifyAuthentication(authenticationJson, credential, expected);
  }
}
