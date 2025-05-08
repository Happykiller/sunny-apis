// src\services\db\model\glossary.db.model.ts
interface LanguageData {
  base: string;
  synonyms: string[];
  plural: string;
  singular: string;
  common_misspellings: string[];
  slang: string[];
}

interface TermData {
  english: LanguageData;
  french: LanguageData;
}

export default interface GlossaryDbModel {
  [term: string]: TermData;
}