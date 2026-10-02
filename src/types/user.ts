export interface IUser {
  id: string;
  name: string | null;
  email: string;
  profile_image: string | null;
  /** Paid credits. */
  credits: number;
  /** Free starter credits, spent first. Images made with them are watermarked until a purchase. */
  free_credits?: number;
  created_at: Date;
  updated_at: Date;
}

export interface IUpdateUserRequest {
  name?: string;
  email?: string;
  profile_image?: string;
}

/** Everything the user can spend: free starter credits plus paid ones. */
export const totalCredits = (user: Pick<IUser, "credits" | "free_credits"> | null | undefined) =>
  (user?.credits ?? 0) + (user?.free_credits ?? 0);
