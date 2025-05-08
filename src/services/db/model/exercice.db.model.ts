// src\services\db\model\exercice.db.model.ts
import { LanguageDbModel } from './language.db.model';

export class ExerciceDbModel {
  id: string;
  slug: string;
  title: LanguageDbModel[];
  description: LanguageDbModel[];
  image: string;
  creator_id?: string;
  contributors_id?: string[];
  active?: boolean;
}