export type GetStylesParams = {
  lastDocId?: string;
  limit?: number;
};

export enum ECategory {
  SPORTS = "Sports",
  PROFESSIONS = "Professions",
  THEMES = "Themes",
}

export interface IStyle {
  id: number;
  name: string;
  category: ECategory;
  image: string;
}
