// src\graphql\auth\auth.resolver.ts
import { JwtService } from '@nestjs/jwt';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';

import { UserSession } from './jwt.strategy';
import { CurrentSession } from '../guard/userSession.decorator';
import { AuthModelResolver } from './model/auth.resolver.model';
import { AuthAuthResolverDto } from './dto/auth.auth.resolver.dto';
import { PasskeyAuthResolverDto } from './dto/passkey.auth.resolver.dto';
import { UserSessionResolverModel } from './model/user.session.resolver.model';
import { UpdPasswordAuthResolverDto } from './dto/updPassword.auth.resolver.dto';
import { makeAuthGuard } from '../guard/auth.guard.factory';
import { USER_ROLE } from '../guard/userRole';

@Resolver('AuthResolver')
export class AuthResolver {
  constructor(
    private jwtService: JwtService,
    @Inject('Inversify')
    private inversify: any,
  ) {}

  @Query(
    /* istanbul ignore next */
    (): typeof AuthModelResolver => AuthModelResolver,
  )
  async auth(
    @Args('dto') dto: AuthAuthResolverDto,
  ): Promise<AuthModelResolver> {
    const userSession: UserSessionResolverModel =
      await this.inversify.authUsecase.execute(dto);

    if (!userSession) {
      throw new UnauthorizedException('Credentials wrong');
    }

    const token = this.jwtService.sign({
      code: userSession.code,
      id: userSession.id,
    });
    return {
      access_token: token,
      ...userSession,
    };
  }

  @Query(
    /* istanbul ignore next */
    (): typeof AuthModelResolver => AuthModelResolver,
  )
  async auth_passkey(
    @Args('dto') dto: PasskeyAuthResolverDto,
  ): Promise<AuthModelResolver> {
    const userSession: UserSessionResolverModel =
      await this.inversify.authPasskeyUsecase.execute(dto);

    if (!userSession) {
      throw new UnauthorizedException('Credentials wrong');
    }

    const token = this.jwtService.sign({
      code: userSession.code,
      id: userSession.id,
    });
    return {
      access_token: token,
      ...userSession,
    };
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.USER, USER_ROLE.ADMIN]))
  @Query(
    /* istanbul ignore next */
    (): typeof AuthModelResolver => AuthModelResolver,
  )
  async getSessionInfo(
    @CurrentSession() session: UserSession,
  ): Promise<AuthModelResolver> {
    const userSession: UserSessionResolverModel =
      await this.inversify.getUserUsecase.execute({
        id: session.id,
      });

    if (!userSession) {
      throw new UnauthorizedException('Credentials wrong');
    }

    const token = this.jwtService.sign({
      code: userSession.code,
      id: userSession.id,
      role: userSession.role,
    });
    return {
      access_token: token,
      ...userSession,
    };
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.USER, USER_ROLE.ADMIN]))
  @Mutation(
    /* istanbul ignore next */
    (): typeof AuthModelResolver => AuthModelResolver,
  )
  async update_password(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: UpdPasswordAuthResolverDto,
  ): Promise<AuthModelResolver> {
    const userSession: UserSessionResolverModel =
      await this.inversify.updPasswordUsecase.execute({
        user_id: session.id,
        ...dto,
      });

    if (!userSession) {
      throw new UnauthorizedException('Credentials wrong');
    }

    const token = this.jwtService.sign({
      code: userSession.code,
      id: userSession.id,
      role: userSession.role,
    });
    return {
      access_token: token,
      ...userSession,
    };
  }
}
