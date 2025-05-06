// src\graphql\auth\dto\passkey.auth.resolver.dto.ts
import { Field, InputType } from '@nestjs/graphql';
import { AuthenticationJSON } from '@passwordless-id/webauthn/dist/esm/types';

@InputType()
class PasskeyAuthResponseResolverDto {
  @Field(() => String)
  authenticatorData: string;
  @Field(() => String)
  clientDataJSON: string;
  @Field(() => String)
  signature: string;
  @Field(() => String, { nullable: true })
  userHandle?: string;
}

@InputType()
export class PasskeyAuthAuthenticationResolverDto {
  @Field(() => String)
  id: string;
  @Field(() => String)
  rawId: string;
  @Field(() => String)
  type: string;
  @Field(() => String, { nullable: true })
  authenticatorAttachment?: string;
  @Field(() => PasskeyAuthResponseResolverDto)
  response: PasskeyAuthResponseResolverDto;
}

@InputType()
export class PasskeyAuthResolverDto {
  @Field(() => String)
  user_code: string;
  @Field(() => PasskeyAuthAuthenticationResolverDto)
  authentication: AuthenticationJSON;
}
