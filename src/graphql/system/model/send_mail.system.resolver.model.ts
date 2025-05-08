// src\presentation\system\model\send_mail.system.resolver.model.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SendMailSystemResolverModel {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}
