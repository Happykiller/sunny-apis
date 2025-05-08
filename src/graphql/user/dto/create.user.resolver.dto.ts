// src\graphql\user\dto\create.user.resolver.dto.ts
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserResolverDto {
  @Field(() => String, { description: 'Code of the user' })
  code: string;
  @Field(() => String)
  name_first: string;
  @Field(() => String)
  name_last: string;
  @Field(() => String)
  description: string;
  @Field(() => String)
  mail: string;
  @Field(() => String)
  password: string;
}
