// src\usecase\user\dto\update.user.usecase.dto.ts
import { UpdateUserResolverDto } from '../../../graphql/user/dto/update.user.resolver.dto';

export interface UpdateUserUsecaseDto extends UpdateUserResolverDto {
  // Id de l'appelant, posé par le resolver depuis la session. Sert au garde-fou
  // d'auto-désactivation ; jamais exposé dans le schéma GraphQL.
  requester_id?: string;
}
