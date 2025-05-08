// src\services\password\password.service.ts
import { GeneratePasswordServiceDto } from './dto/generate.password.service.dto';

export interface PasswordService {
  generate(dto: GeneratePasswordServiceDto): string;
}
