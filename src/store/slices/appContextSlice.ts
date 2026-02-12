import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isModelTrainingDialogOpen: false,
  isProfileDrawerOpen: false,
};

const appContextSlice = createSlice({
  name: "appContext",
  initialState,
  reducers: {
    setAppContext(state, action: PayloadAction<Partial<typeof initialState>>) {
      return { ...state, ...action.payload };
    },
    resetAppContext() {
      return initialState;
    },
  },
});

export const { setAppContext, resetAppContext } = appContextSlice.actions;
export default appContextSlice.reducer;
