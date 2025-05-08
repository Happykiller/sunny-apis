// src\graphql\guard\userSession.decorator.ts
import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserSession } from '../auth/jwt.strategy';

export const CurrentSession = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserSession => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
