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
  /**
   * Facultatif depuis la reprise du protocole : c'est la credential présentée
   * qui désigne le compte. Un navigateur qui n'a jamais servi à s'enregistrer
   * — le cas d'une passkey synchronisée ouverte sur un autre poste — ne
   * connaît aucun `user_code` et doit pouvoir se connecter quand même.
   *
   * Conservé plutôt que supprimé : les clients déjà déployés continuent de
   * l'envoyer, et quand il est là il est vérifié contre la credential.
   */
  @Field(() => String, { nullable: true })
  user_code?: string;
  @Field(() => PasskeyAuthAuthenticationResolverDto)
  authentication: AuthenticationJSON;
}
