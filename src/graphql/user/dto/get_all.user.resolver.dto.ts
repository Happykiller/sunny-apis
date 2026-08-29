// src\graphql\user\dto\get_all.user.resolver.dto.ts
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetAllUserResolverDto {
  @Field(() => Boolean, {
    nullable: true,
    description:
      'Include deactivated accounts. Off by default: the listing has always shown active users only.',
  })
  include_inactive?: boolean;
}
