// src\graphql\auth\model\user.resolver.model.ts
export interface UserResolverModel {
  id: string;
  code: string;
  password: string;
  name_first: string;
  name_last: string;
  description: string;
  mail: string;
  role: string;
  active: boolean;
}
