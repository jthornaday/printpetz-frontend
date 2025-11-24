export interface IUser {
  id: string;
  name: string | null;
  email: string;
  profile_image: string | null;
  credit: number;
  created_at: Date;
  updated_at: Date;
}

export interface IUpdateUserRequest {
  name?: string;
  email?: string;
  profile_image?: string;
}
