// src\graphql\passkey\dto\passkey.register.auth.resolver.dto.ts
import { Field, InputType } from '@nestjs/graphql';
import { RegistrationJSON } from '@passwordless-id/webauthn/dist/esm/types';

@InputType()
class RegisterResponsePasskeyResolverDto {
  @Field(() => String)
  attestationObject: string;

  @Field(() => String)
  authenticatorData: string;

  @Field(() => String)
  clientDataJSON: string;

  @Field(() => String)
  publicKey: string;

  @Field(() => Number)
  publicKeyAlgorithm: number;

  @Field(() => [String])
  transports: string[];
}

@InputType()
class RegisterUserPasskeyResolverDto {
  @Field(() => String)
  name: string;

  @Field(() => String)
  id: string;
}

@InputType()
class RegisterPasskeyResolverDto {
  @Field(() => String)
  type: string;

  @Field(() => String)
  id: string;

  @Field(() => String)
  rawId: string;

  @Field(() => String)
  authenticatorAttachment?: string;

  @Field(() => RegisterResponsePasskeyResolverDto)
  response: RegisterResponsePasskeyResolverDto;

  @Field(() => RegisterUserPasskeyResolverDto)
  user: RegisterUserPasskeyResolverDto;
}

@InputType()
export class CreatePasskeyResolverDto {
  @Field(() => String)
  label: string;

  @Field(() => String)
  hostname: string;

  @Field(() => String)
  challenge: string;

  @Field(() => RegisterPasskeyResolverDto)
  registration: RegistrationJSON;
}
