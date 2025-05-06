// src/presentation/test/dto/ping-response.dto.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PingResponse {
  @Field(() => String)
  message: string;
}
