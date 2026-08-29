// src\presentation\user\user.resolver.ts
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { USER_ROLE } from '../guard/userRole';
import { UserSession } from '../auth/jwt.strategy';
import { CurrentSession } from '../guard/userSession.decorator';
import { makeAuthGuard } from '../guard/auth.guard.factory';
import { UserModelResolver } from './model/user.resolver.model';
import { GetUserResolverDto } from './dto/get.user.resolver.dto';
import { GetAllUserResolverDto } from './dto/get_all.user.resolver.dto';
import { CreateUserResolverDto } from './dto/create.user.resolver.dto';
import { UpdateUserResolverDto } from './dto/update.user.resolver.dto';

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
  async users(
    @Args('dto', { nullable: true }) dto?: GetAllUserResolverDto,
  ): Promise<UserModelResolver[]> {
    return this.inversify.getAllUserUsecase.execute(dto);
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

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ADMIN]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Mutation((returns) => UserModelResolver)
  async update_user(
    @Args('dto') dto: UpdateUserResolverDto,
    @CurrentSession() session: UserSession,
  ): Promise<UserModelResolver> {
    // L'id de l'appelant vient de la session, jamais du client : c'est ce qui
    // rend fiable le garde-fou d'auto-désactivation du usecase.
    return this.inversify.updateUserUsecase.execute({
      ...dto,
      requester_id: session?.id,
    });
  }
}
