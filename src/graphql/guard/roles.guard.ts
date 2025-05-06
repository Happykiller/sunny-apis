// src\graphql\guard\roles.guard.ts
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  ExecutionContext,
  CanActivate,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';

import { USER_ROLE } from './userRole';
import { ROLES_KEY } from './roles.decorator';
import { UserSession } from '../auth/jwt.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject('Reflector') private readonly injectedReflector: Reflector, // fallback si jamais ça fonctionne
  ) {
    console.log('✅ RolesGuard instantiated');
  }

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.injectedReflector.get<USER_ROLE[]>(
      ROLES_KEY,
      executionContext.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const gqlExecutionContext = GqlExecutionContext.create(executionContext);
    const userSession: UserSession = gqlExecutionContext.getContext().req.user;
    const result = requiredRoles.some((role) =>
      userSession.role?.includes(role),
    );

    if (!result) {
      throw new UnauthorizedException('User role not allowed for this action');
    }

    return result;
  }
}
