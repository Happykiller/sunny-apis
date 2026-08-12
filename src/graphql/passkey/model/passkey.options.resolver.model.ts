// src\graphql\passkey\model\passkey.options.resolver.model.ts
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Ce que le serveur donne au navigateur pour amorcer une **authentification**.
 *
 * Volontairement réduit au challenge : aucune donnée liée à un utilisateur ne
 * doit sortir d'un point d'entrée public, sous peine d'en faire un outil
 * d'énumération des comptes. C'est aussi ce qui permet la connexion sans
 * identifiant — le navigateur propose les passkeys du domaine, le serveur
 * découvre qui se connecte en recevant l'assertion.
 */
@ObjectType()
export class PasskeyAuthOptionsResolverModel {
  @Field(() => String)
  challenge: string;
}

/**
 * Ce que le serveur donne pour amorcer un **enregistrement**, appelé par un
 * utilisateur déjà authentifié.
 */
@ObjectType()
export class PasskeyRegisterOptionsResolverModel {
  @Field(() => String)
  challenge: string;

  /** Identifiant opaque et stable du compte, au sens WebAuthn. */
  @Field(() => String)
  user_handle: string;

  /** Credentials déjà enregistrées, que l'authentificateur doit refuser de
   *  dupliquer. */
  @Field(() => [String])
  exclude_credentials: string[];
}
