// src\services\db\model\passkey.db.model.ts
import { RegistrationInfo, RegistrationJSON } from "@passwordless-id/webauthn/dist/esm/types";

export default interface PasskeyDbModel {
  id: string;
  label: string;
  user_id: string;
  hostname: string;
  user_code: string;
  challenge: string;
  registration: RegistrationJSON;
  registrationParsed: RegistrationInfo;
  active: boolean;
}
