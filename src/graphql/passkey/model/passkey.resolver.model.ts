// src\graphql\passkey\model\passkey.resolver.model.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PasskeyResolverModel {
  @Field(() => String)
  id: string;
  @Field(() => String)
  label: string;
  @Field(() => String)
  user_id: string;
  @Field(() => String)
  hostname: string;
  @Field(() => String)
  user_code: string;
  @Field(() => String)
  credential_id: string;

  /**
   * Le fournisseur qui détient la clé — « Windows Hello », « Google Password
   * Manager », « iCloud Keychain »… Relevé à l'enregistrement seulement (une
   * assertion ne porte pas l'AAGUID), et déjà présent dans
   * `registration_parsed` : rien à migrer, il suffisait de l'exposer.
   */
  @Field(() => String, { nullable: true })
  authenticator_name?: string;

  /**
   * La clé est-elle sauvegardée hors de l'appareil, donc utilisable ailleurs ?
   *
   * C'est le flag *backup eligible* de WebAuthn. Sans lui, l'écran de gestion
   * ment par omission : « Windows Hello sur le PC du bureau » n'a plus de sens
   * quand la clé vit dans un nuage, et l'utilisateur ne peut pas savoir
   * laquelle il perdrait avec son appareil.
   */
  @Field(() => Boolean, { nullable: true })
  synced?: boolean;
}

// `challenge` a été retiré de ce modèle le 12/08/2026. Il n'avait rien à faire
// dans une réponse : le client l'y lisait pour le rejouer à la connexion — le
// mécanisme même qui rendait les assertions rejouables indéfiniment. Le
// challenge est désormais émis par `passkey_auth_options`, à usage unique.
