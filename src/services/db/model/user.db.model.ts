// src\services\db\model\user.db.model.ts
export interface UserDbModel {
  id: string;
  code: string;
  password: string;
  name_first: string;
  name_last: string;
  description: string;
  mail: string;
  role: string;
  active: boolean;
  private_trainings?: string[];
}
