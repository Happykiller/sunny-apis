// src/graphql/test/test.resolver.ts
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { USER_ROLE } from '../guard/userRole';
import { UserSession } from '../auth/jwt.strategy';
import { PingResponse } from './dto/ping-response.dto';
import { makeAuthGuard } from '../guard/auth.guard.factory';
import { CurrentSession } from '../guard/userSession.decorator';

@Resolver(() => PingResponse)
export class TestResolver {
  constructor() {
    console.log('✅ TestResolver loaded');
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ADMIN]))
  @Query(() => PingResponse)
  async ping(
    @CurrentSession() session: UserSession
  ): Promise<PingResponse> {
    console.log('✅ TestResolver#ping => trigger', session);
    return { message: 'pong' };
  }
}