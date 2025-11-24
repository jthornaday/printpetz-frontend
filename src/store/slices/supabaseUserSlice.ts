import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";

// This is only for Auth process
const supabaseAuthUserSlice = createSlice({
  name: "supabaseAuthUser",
  initialState: null as User | null,
  reducers: {
    setSupabaseAuthUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    clearSupabaseAuthUser: () => {
      return null;
    },
  },
});

export const { setSupabaseAuthUser, clearSupabaseAuthUser } = supabaseAuthUserSlice.actions;
export default supabaseAuthUserSlice.reducer;
