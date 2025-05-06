// src\graphql\guard\secured.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { USER_ROLE } from './userRole';
import { GqlAuthGuard } from './gql.auth.guard';
import { RolesGuard } from './roles.guard';

/**
 * Combines @Roles and @UseGuards(GqlAuthGuard, RolesGuard) for DRY secured access.
 */
export function Secured(...roles: USER_ROLE[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(GqlAuthGuard, RolesGuard),
  );
}
