// src\usecase\passkey\dto\create.passkey.usecase.dto.ts

import { CreatePasskeyResolverDto } from '../../../graphql/passkey/dto/passkey.register.auth.resolver.dto';

export default interface CreatePasskeyUsecaseDto
  extends CreatePasskeyResolverDto {
  user_id: string;
  user_code: string;
}
