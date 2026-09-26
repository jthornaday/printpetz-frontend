import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppContextState = {
  isModelTrainingDialogOpen: boolean;
  isProfileDrawerOpen: boolean;
  // The batch Create started, kept here rather than in Create's own state so
  // the double-generate guard survives navigating to Gallery and back. Not
  // persisted, so a reload clears it, same as before. Scoped to a user so a
  // different login in the same tab isn't blocked by someone else's batch.
  activeGeneration: { userId: string; groupId: number } | null;
  // The pet the user picked on Create, kept here for the same reason: Create
  // unmounts when they visit Gallery, and the selection must not reset to the
  // newest model on the way back. Only the id is stored; the model itself is
  // looked up from the models query so it never goes stale. Scoped to a user
  // like activeGeneration. Not persisted.
  selectedModel: { userId: string; modelId: number } | null;
};

const initialState: AppContextState = {
  isModelTrainingDialogOpen: false,
  isProfileDrawerOpen: false,
  activeGeneration: null,
  selectedModel: null,
};

const appContextSlice = createSlice({
  name: "appContext",
  initialState,
  reducers: {
    setAppContext(state, action: PayloadAction<Partial<AppContextState>>) {
      return { ...state, ...action.payload };
    },
    // Closes dialogs and drawers; an in-progress batch is still in progress and
    // the chosen pet is still chosen.
    resetAppContext(state) {
      return {
        ...initialState,
        activeGeneration: state.activeGeneration,
        selectedModel: state.selectedModel,
      };
    },
  },
});

export const { setAppContext, resetAppContext } = appContextSlice.actions;
export default appContextSlice.reducer;
