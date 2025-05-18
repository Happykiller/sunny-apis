// src\graphql\hello\hello.resolver.ts
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { USER_ROLE } from '../guard/userRole';
import { makeAuthGuard } from '../guard/auth.guard.factory';
import { HelloModelResolver } from './model/hello.resolver.model';

@Resolver((of) => HelloModelResolver)
export class HelloResolver {
  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ADMIN]))
  @Query((returns) => HelloModelResolver)
  async hello(): Promise<HelloModelResolver> {
    return {
      message: 'Hello World',
    };
  }
}
