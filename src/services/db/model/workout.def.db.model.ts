// src\services\db\model\workout.def.db.model.ts
import { LanguageDbModel } from './language.db.model';

export class WorkoutDefDbModel {
  id: string;
  slug: string;
  title: LanguageDbModel[];
  description: LanguageDbModel[];
  image?: string;
  creator_id?: string;
  contributors_id?: string[];
  active?: boolean;
}