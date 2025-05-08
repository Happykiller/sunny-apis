// src\services\password\password.service.real.ts
import { PasswordService } from './password.service';
import { GeneratePasswordServiceDto } from './dto/generate.password.service.dto';

export class PasswordServiceReal implements PasswordService {
  generate(dto: GeneratePasswordServiceDto): string {
    const lowercases = 'abcdefghijkmnopqrstuvwxyz';
    const uppercases = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialsCaracters = '?!%$&#@_-+=*/';
    let all :any;
    if (dto.specials) {
      all = lowercases + uppercases + numbers + specialsCaracters;
    } else {
      all = lowercases + uppercases + numbers;
    }
    let result = '';
    for (let i = 0; i < dto.length; i++) {
      const position = Math.floor(Math.random() * all.length);
      result += all.substr(position, 1);
    }

    return result;
  }
}
