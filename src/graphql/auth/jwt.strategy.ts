// src\graphql\auth\jwt.strategy.ts
/* istanbul ignore file */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { UserResolverModel } from './model/user.resolver.model';

export interface UserSession {
  id: string;
  code: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('Inversify')
    private inversify: any,
    @Inject('AppConfig')
    appConfig: any,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwt.secret,
    });
  }

  async validate(payload: { code?: string }): Promise<UserSession> {
    if (!payload.code) {
      throw new UnauthorizedException();
    } else {
      const user: UserResolverModel = await this.inversify.getUserUsecase.execute({
        code: payload.code,
      });
      return new Promise((resolve) => {
        resolve({
          id: user.id,
          code: user.code,
          role: user.role,
        });
      });
    }
  }
}
