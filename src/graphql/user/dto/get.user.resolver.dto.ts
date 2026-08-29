// src\graphql\user\dto\get.user.resolver.dto.ts
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetUserResolverDto {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  code?: string;
  @Field(() => Boolean, {
    nullable: true,
    description:
      'Also match deactivated accounts. Needed to read, or reactivate, a revoked user.',
  })
  include_inactive?: boolean;
}
