// src\graphql\user\dto\update.user.resolver.dto.ts
import { Field, InputType } from '@nestjs/graphql';

// Mise à jour partielle : seul `user_id` est requis, chaque autre champ absent
// laisse la valeur existante intacte.
//
// `role` est délibérément absent : promouvoir ou rétrograder un administrateur
// n'est pas un geste de modération courante, et cette mutation est le chemin
// qu'empruntent les automatisations.
@InputType()
export class UpdateUserResolverDto {
  @Field(() => String, { description: 'Id of the user to update' })
  user_id: string;
  @Field(() => String, { nullable: true, description: 'Code of the user' })
  code?: string;
  @Field(() => String, { nullable: true })
  name_first?: string;
  @Field(() => String, { nullable: true })
  name_last?: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => String, { nullable: true })
  mail?: string;
  @Field(() => String, { nullable: true })
  password?: string;
  @Field(() => Boolean, {
    nullable: true,
    description:
      'Set to false to revoke access without deleting anything. The guard reloads the user on every request, so the effect is immediate.',
  })
  active?: boolean;
}
