// src\graphql\auth\model\auth.resolver.model.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthModelResolver {
  @Field(() => String, { description: 'Session token' })
  access_token: string;
  @Field(() => String, { description: 'Id of the user' })
  id: string;
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
  role: string;
}
