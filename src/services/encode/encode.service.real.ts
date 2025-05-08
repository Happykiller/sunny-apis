// src\services\encode\encode.service.real.ts
import { enc, AES } from 'crypto-js';

import { EncodeService } from './encode.service';
import { EncodeEncodeServiceDto } from './dto/encode.encode.service.dto';
import { DecodeEncodeServiceDto } from './dto/decode.encode.service.dto';

export class EncodeServiceReal implements EncodeService {
  IV = enc.Utf8.parse('victor');

  encode(dto: EncodeEncodeServiceDto): string {
    const crypted = AES.encrypt(dto.message, dto.secret, {
      iv: this.IV,
    });
    return crypted.toString();
  }

  decode(dto: DecodeEncodeServiceDto): string {
    const decrypt = AES.decrypt(`${dto.message}`, dto.secret, {
      iv: this.IV,
    });
    const decryptText = decrypt.toString(enc.Utf8);
    return decryptText;
  }
}
