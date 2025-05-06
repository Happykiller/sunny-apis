// src/graphql/test/test.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';

import { PingResponse } from './dto/ping-response.dto';

@Resolver(() => PingResponse)
export class TestResolver {
  @Query(() => PingResponse)
  async ping(): Promise<PingResponse> {
    return { message: 'pong' };
  }
}