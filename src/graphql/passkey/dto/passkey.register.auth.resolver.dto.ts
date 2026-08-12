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

  /**
   * Le nom lisible que l'authentificateur affiche à l'utilisateur.
   *
   * Il n'apparaissait pas ici tant que le client passait une simple chaîne en
   * guise d'utilisateur : la bibliothèque en faisait alors un `{ id, name }`
   * et rien de plus. Depuis que le serveur fournit un `id` stable, l'objet
   * complet revient dans la réponse — et un champ non déclaré fait rejeter
   * toute la requête par GraphQL, avant même d'atteindre le usecase.
   */
  @Field(() => String, { nullable: true })
  displayName?: string;
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
