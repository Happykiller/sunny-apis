// src\presentation\system\system.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';

import { USER_ROLE } from '../guard/userRole';
import { makeAuthGuard } from '../guard/auth.guard.factory';
import { SystemInfoResolverModel } from './model/info.system.resolver.model';
import { SendMailSystemResolverModel } from './model/send_mail.system.resolver.model';

@Resolver('SystemResolver')
export class SystemResolver {
  constructor(
    @Inject('Version')
    private readonly version: string,
    @Inject('Inversify')
    private readonly inversify: any,
  ) { }

  @Query(() => SystemInfoResolverModel)
  async systemInfo(): Promise<SystemInfoResolverModel> {
    return {
      version: this.version
    };
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ADMIN]))
  @Query(() => SendMailSystemResolverModel)
  async test_mail(): Promise<SendMailSystemResolverModel> {
    return await this.inversify.morgansService.sendTest('fabrice.rosito@gmail.com');
  }
}
