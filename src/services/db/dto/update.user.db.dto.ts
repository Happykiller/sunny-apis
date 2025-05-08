// src\services\db\dto\update.user.db.dto.ts
export interface UpdateUserDbDto {
  user_id: string;
  code?: string;
  password?: string;
  name_first?: string;
  name_last?: string;
  description?: string;
  mail?: string;
  role?: string;
  active?: boolean;
}
