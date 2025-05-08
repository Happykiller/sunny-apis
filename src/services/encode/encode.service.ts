// src\services\encode\encode.service.ts
import { DecodeEncodeServiceDto } from './dto/decode.encode.service.dto';
import { EncodeEncodeServiceDto } from './dto/encode.encode.service.dto';

export interface EncodeService {
  encode(dto: EncodeEncodeServiceDto): string;
  decode(dto: DecodeEncodeServiceDto): string;
}
