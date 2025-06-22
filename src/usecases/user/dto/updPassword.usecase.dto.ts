// src\usecase\auth\dto\updPassword.usecase.dto.ts
import { UpdPasswordAuthResolverDto } from '../../../graphql/auth/dto/updPassword.auth.resolver.dto';

export interface UpdPasswordAuthUsecaseDto extends UpdPasswordAuthResolverDto {
  user_id: string;
}
