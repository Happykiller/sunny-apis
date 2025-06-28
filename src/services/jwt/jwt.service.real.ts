// src\services\jwt\jwt.service.real.ts
import * as jwt from 'jsonwebtoken';

import { JwtService } from './jwt.service';
import { ConfigurationBase } from '../../config/configurationBase';

export class JwtServiceReal implements JwtService {

  constructor(private readonly config: ConfigurationBase) {}

  sign(dto: any): string {
    const token: string = jwt.sign(
      {
        code: dto.code,
        id: dto.id
      },
      this.config.jwt.secret,
      {
        expiresIn: this.config.jwt.signOptions.expiresIn
      }
    );
    return token;
  }

  decode(token: string): any {
    return jwt.decode(token);
  }

  verify(token: string): any {
    const payload = jwt.verify(token, this.config.jwt.secret);
    return payload;
  }
}