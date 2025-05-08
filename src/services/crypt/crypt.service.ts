// src\services\crypt\crypt.service.ts
import { CryptServiceDto } from './dto/crypt.service.dto';

export interface CryptService {
  crypt(dto: CryptServiceDto): string;
}
