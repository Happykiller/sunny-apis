// src\graphql\passkey\model\passkey.resolver.model.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PasskeyResolverModel {
  @Field(() => String)
  id: string;
  @Field(() => String)
  label: string;
  @Field(() => String)
  user_id: string;
  @Field(() => String)
  hostname: string;
  @Field(() => String)
  user_code: string;
  @Field(() => String)
  challenge: string;
  @Field(() => String)
  credential_id: string;
}
