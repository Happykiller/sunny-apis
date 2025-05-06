// src\graphql\guard\gql.auth.guard.ts
import * as jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserSession } from '../auth/jwt.strategy';
import { UserResolverModel } from '../auth/model/user.resolver.model';

export class Context {
  req: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  res: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject('Inversify')
    private inversify: any,
    @Inject('AppConfig')
    private appConfig: any,
  ) {
    super();
  }

  /* istanbul ignore next */
  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const gqlExecutionContext = GqlExecutionContext.create(executionContext);
    const context: Context = gqlExecutionContext.getContext();
    const accessToken = ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
    ])(context.req);

    if (!accessToken)
      throw new UnauthorizedException('Access token is not set');

    let userSession: UserSession;
    try {
      userSession = jwt.verify(accessToken, this.appConfig.jwt.secret) as UserSession;
    } catch (err) {
      throw new UnauthorizedException('Token expired');
    }

    const user: UserResolverModel = await this.inversify.getUserUsecase.execute({
      id: userSession.id,
    });

    if (user) {
      const refreshToken: string = jwt.sign(
        {
          code: userSession.code,
          id: userSession.id,
        },
        this.appConfig.jwt.secret,
        {
          expiresIn: this.appConfig.jwt.signOptions.expiresIn,
        },
      );

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is not set');
      }

      if (!user.active) throw new UnauthorizedException('User is deactivated');
      context.res.header(this.appConfig.jwt.refreshTokenName, refreshToken);
    } else {
      throw new UnauthorizedException('User is not set');
    }

    return this.activate(executionContext);
  }

  /* istanbul ignore next */
  async activate(executionContext: ExecutionContext): Promise<boolean> {
    return super.canActivate(executionContext) as Promise<boolean>;
  }

  getRequest(executionContext: ExecutionContext): unknown {
    const gqlExecutionContext = GqlExecutionContext.create(executionContext);
    const context: Context = gqlExecutionContext.getContext();
    return context.req;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  handleRequest(err: any, userSession: UserSession): any {
    if (err || !userSession) {
      throw new UnauthorizedException('Session is not set');
    }
    return userSession as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}
