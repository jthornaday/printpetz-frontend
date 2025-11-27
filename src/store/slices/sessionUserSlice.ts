import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";

const sessionUserSlice = createSlice({
  name: "sessionUser",
  initialState: null as User | null,
  reducers: {
    setSessionUser: (state, action: PayloadAction<User | null>) => {
      return action.payload;
    },
    clearSessionUser: () => {
      return null;
    },
  },
});

export const { setSessionUser, clearSessionUser } = sessionUserSlice.actions;
export default sessionUserSlice.reducer;
