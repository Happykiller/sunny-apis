// src\graphql\hello\model\hello.resolver.model.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HelloModelResolver {
  @Field(() => String, { nullable: true })
  message: string;
}
