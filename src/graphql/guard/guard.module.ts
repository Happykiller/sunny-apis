// src/graphql/guard/guard.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { RolesGuard } from '../guard/roles.guard';
import { GqlAuthGuard } from '../guard/gql.auth.guard';
import { CustomAuthGuard } from '../guard/custom.auth.guard';

@Module({
  providers: [
    GqlAuthGuard,
    CustomAuthGuard,
    RolesGuard,
    { provide: APP_GUARD, useClass: GqlAuthGuard },
  ],
  exports: [GqlAuthGuard, CustomAuthGuard, RolesGuard],
})
export class AuthGuardModule {}
