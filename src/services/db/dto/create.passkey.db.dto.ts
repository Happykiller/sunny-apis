// src\services\db\dto\create.passkey.db.dto.ts
import { RegistrationInfo } from '@passwordless-id/webauthn/dist/esm/types';

import CreatePasskeyUsecaseDto from '../../../usecases/passkey/dto/create.passkey.usecase.dto';

export interface CreatePasskeyDbDto extends CreatePasskeyUsecaseDto {
  registrationParsed: RegistrationInfo
}
