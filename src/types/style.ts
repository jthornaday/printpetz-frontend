export type GetStylesParams = {
  lastDocId?: string;
  limit?: number;
};

// Mirrors the GENERATION_CATEGORY enum in Postgres. The five values below
// SPORTS/PROFESSIONS/THEMES arrived with the 47-theme expansion and were never
// added here, so the type has been claiming categories exist that do not and
// vice versa. Nothing gated on it at runtime — StyleSelector derives its tabs
// from the data — so this is a type-accuracy fix, not a behaviour change.
export enum ECategory {
  SPORTS = "Sports",
  PROFESSIONS = "Professions",
  THEMES = "Themes",
  CHRISTMAS = "Christmas",
  THANKSGIVING = "Thanksgiving",
  FOURTH_OF_JULY = "4th of July",
  HISTORICAL = "Historical",
  HEROES = "Heroes",
}

export interface IStyle {
  id: number;
  name: string;
  category: ECategory;
  image: string;
  // False hides the theme from the picker. getStyles filters on it, so rows
  // returned to the app are always true — the field is here to match the table.
  is_active: boolean;
}
