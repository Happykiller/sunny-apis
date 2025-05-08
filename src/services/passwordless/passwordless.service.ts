// src\services\passwordless\passwordless.service.ts
import { AuthenticationInfo, AuthenticationJSON, CredentialInfo, RegistrationInfo, RegistrationJSON } from '@passwordless-id/webauthn/dist/esm/types';

export interface PasswordLessService {
  verifyRegistration(registrationJson: RegistrationJSON, expected: any): Promise<RegistrationInfo>;
  verifyAuthentication(authenticationJson: AuthenticationJSON, credential: CredentialInfo, expected: any): Promise<AuthenticationInfo>;
}
