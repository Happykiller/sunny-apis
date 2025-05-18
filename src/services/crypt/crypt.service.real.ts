// src\services\crypt\crypt.service.real.ts
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import HmacSHA512 from 'crypto-js/hmac-sha512';

import { ERRORS } from '../../common/ERROR';
import { CryptService } from './crypt.service';
import { CryptServiceDto } from './dto/crypt.service.dto';

export class CryptServiceReal implements CryptService {

  constructor(private readonly config: any) {}

  crypt(dto: CryptServiceDto): string {
    if (!this.config.app_name) {
      throw Error(ERRORS.CRYPT_SERVICE_APP_NAME_WRONG);
    }

    if (!dto.secret && this.config.jwt.secret) {
      throw Error(ERRORS.CRYPT_SERVICE_SECRET_WRONG);
    }

    const hashDigest = sha256(this.config.app_name + dto.message);
    const hmacDigest = Base64.stringify(
      HmacSHA512(hashDigest, dto.secret ?? this.config.jwt.secret),
    );
    return hmacDigest;
  }
}
