import { useCallback } from "react";
import { useGetUser } from "@/hooks/user/useGetUser";
import { useGetModels } from "@/hooks/model/useGetModels";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAppContext } from "@/store/slices/appContextSlice";
import { IModel } from "@/types/model";

/**
 * The pet chosen on Create, held in the store so it survives navigating away
 * and back. Resolves to null when nothing is chosen, when it was chosen by a
 * different login, or when that model is no longer in the list -- all cases
 * where the selector may pick a default.
 */
export const useSelectedModel = () => {
  const dispatch = useAppDispatch();
  const { user } = useGetUser();
  const { models } = useGetModels(user?.id);
  const stored = useAppSelector((state) => state.appContext.selectedModel);

  const selectedModel: IModel | null =
    stored && stored.userId === user?.id
      ? (models.find((model) => model.id === stored.modelId) ?? null)
      : null;

  const userId = user?.id;
  const setSelectedModel = useCallback(
    (model: IModel | null) => {
      if (!userId) return;
      dispatch(
        setAppContext({ selectedModel: model ? { userId, modelId: model.id } : null })
      );
    },
    [dispatch, userId]
  );

  return { selectedModel, setSelectedModel };
};
