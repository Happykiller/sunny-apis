// src\graphql\auth\dto\updPassword.auth.resolver.dto.ts
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdPasswordAuthResolverDto {
  @Field(() => String)
  old_value: string;
  @Field(() => String)
  new_value: string;
  @Field(() => String)
  conf_value: string;
}
