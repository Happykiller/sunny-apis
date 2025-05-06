// src\graphql\auth\dto\auth.auth.resolver.dto.ts
import { Field, InputType } from '@nestjs/graphql';
import { Matches, MaxLength, MinLength } from 'class-validator';

import { REGEX } from '../../../common/REGEX';

@InputType()
export class AuthAuthResolverDto {
  @MinLength(3, {
    message: 'Login is too short',
  })
  @MaxLength(50, {
    message: 'Login is too long',
  })
  @Matches(new RegExp(REGEX.LOGIN), {
    message: 'Login not match to regex',
  })
  @Field({ description: 'User code for the session' })
  login: string;

  @MinLength(3, {
    message: 'Password is too short',
  })
  @MaxLength(50, {
    message: 'Password is too long',
  })
  @Matches(new RegExp(REGEX.PASSWORD), {
    message: 'Password not match to regex',
  })
  @Field({ description: 'Password for the session' })
  password: string;
}
