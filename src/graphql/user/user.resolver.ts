// src\presentation\user\user.resolver.ts
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { USER_ROLE } from '../guard/userRole';
import { makeAuthGuard } from '../guard/auth.guard.factory';
import { UserModelResolver } from './model/user.resolver.model';
import { GetUserResolverDto } from './dto/get.user.resolver.dto';
import { CreateUserResolverDto } from './dto/create.user.resolver.dto';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver((of) => UserModelResolver)
export class UserResolver {
  constructor(
    @Inject('Inversify')
    private inversify: any,
  ) {}

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ADMIN]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => [UserModelResolver])
  async users(): Promise<UserModelResolver[]> {
    return this.inversify.getAllUserUsecase.execute();
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ADMIN]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => UserModelResolver)
  async user(@Args('dto') dto: GetUserResolverDto): Promise<UserModelResolver> {
    return this.inversify.getUserUsecase.execute(dto);
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ADMIN]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Mutation((returns) => UserModelResolver)
  async create_user(
    @Args('dto') dto: CreateUserResolverDto,
  ): Promise<UserModelResolver> {
    return this.inversify.createUserUsecase.execute(dto);
  }
}
