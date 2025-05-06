// src\graphql\guard\userSession.decorator.ts
/* istanbul ignore file */
import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserSession } from '../auth/jwt.strategy';

/* istanbul ignore next */
export const CurrentSession = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserSession => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
