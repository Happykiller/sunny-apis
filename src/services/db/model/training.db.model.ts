// src\services\db\model\training.db.model.ts
export interface TrainingDbModel {
  id: string;
  slug: string;
  label?: string;
  gender?: string;
  isPrivate?: boolean;
  workout: WorkoutDbModel[];
  creator_id?: string;
  contributors_id?: string[];
  active?: boolean;
}

export interface WorkoutDbModel {
  slug: string;
  sets: SetDbModel[];
}

export interface SetDbModel {
  rep?: number;
  slugs?: string[];
  ite?: number,
  weight?: number,
  duration?: number;
  rest?: number;
  pause?: number;
  sets?: SetDbModel[];
}