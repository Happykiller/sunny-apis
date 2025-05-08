// src\graphql\guard\auth.guard.factory.ts
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

import { USER_ROLE } from './userRole';
import { UserSession } from '../auth/jwt.strategy';
import { UserResolverModel } from '../auth/model/user.resolver.model';

let inversify: any;
let appConfig: any;

export function configureAuthGuardFactory(opts: {
  inversify: any;
  appConfig: any;
}) {
  inversify = opts.inversify;
  appConfig = opts.appConfig;
}

export function makeAuthGuard(
  mode: 'http' | 'graphql',
  requiredRoles?: USER_ROLE[],
): CanActivate {
  return {
    canActivate: async (context: ExecutionContext): Promise<boolean> => {
      const { req, res } = extractRequestResponse(context, mode);
      const token = extractToken(req, mode);
      if (!token) throw new UnauthorizedException('Access token is not set');

      const userSession = verifyJwt(token, appConfig.jwt.secret);
      const user = await findActiveUser(userSession.id);

      req.user = {
        id: user.id,
        code: user.code,
        role: user.role,
      } satisfies UserSession;

      const refreshToken = createRefreshToken(userSession);
      res?.setHeader?.(appConfig.jwt.refreshTokenName, refreshToken);

      // Optional role check
      if (requiredRoles?.length > 0) {
        const hasRole =
          requiredRoles.includes(USER_ROLE.ALL) ||
          requiredRoles.some((r) => user.role?.includes(r));
        if (!hasRole) {
          throw new UnauthorizedException('Insufficient role');
        }
      }

      return true;
    },
  };
}

/* ------------------- Private helpers ------------------- */

function extractRequestResponse(context: ExecutionContext, type: 'http' | 'graphql') {
  if (type === 'graphql') {
    const gqlCtx = GqlExecutionContext.create(context).getContext();
    return { req: gqlCtx.req, res: gqlCtx.res };
  }
  const httpCtx = context.switchToHttp();
  return { req: httpCtx.getRequest(), res: httpCtx.getResponse() };
}

function extractToken(req: any, type: 'http' | 'graphql'): string | null {
  const header = req.headers?.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  if (type === 'http' && typeof req.query?.token === 'string') {
    return req.query.token;
  }
  return null;
}

function verifyJwt(token: string, secret: string): UserSession {
  try {
    return jwt.verify(token, secret) as UserSession;
  } catch {
    throw new UnauthorizedException('Token expired');
  }
}

async function findActiveUser(userId: string): Promise<UserResolverModel> {
  const user = await inversify.getUserUsecase.execute({ id: userId });
  if (!user) throw new UnauthorizedException('User is not set');
  if (!user.active) throw new UnauthorizedException('User is deactivated');
  return user;
}

function createRefreshToken(userSession: UserSession): string {
  return jwt.sign(
    { id: userSession.id, code: userSession.code },
    appConfig.jwt.secret,
    { expiresIn: appConfig.jwt.signOptions.expiresIn }
  );
}
