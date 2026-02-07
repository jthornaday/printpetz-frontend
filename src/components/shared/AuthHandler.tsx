import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ROUTES } from "@/routes";
import { PageLoader } from "../ui/loader";
import { supabase } from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import { authRoutes } from "@/utils/constants/appConstants";
import { useAppDispatch, useAppSelector } from "@/store";
import { supabaseBaseApi } from "@/store/api/baseApi";
import { clearSessionUser, setSessionUser } from "@/store/slices/sessionUserSlice";

type Props = { children: React.ReactNode };

const AuthHandler = ({ children }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const sessionUser = useAppSelector((state) => state.sessionUser);

  const [initializing, setInitializing] = useState(true);

  const handleAuthStateChange = useCallback(
    async (session: Session | null) => {
      try {
        console.log("session", { session, sessionUser });
        if (session) {
          if (sessionUser?.id !== session.user?.id) {
            dispatch(setSessionUser(session.user));
          }
          if (ROUTES.login === router.pathname) {
            router.replace(ROUTES.create);
          }
        } else {
          if (!authRoutes.includes(router.pathname)) {
            dispatch(clearSessionUser());
            dispatch(supabaseBaseApi.util.resetApiState());
            router.replace(ROUTES.login);
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        router.replace(ROUTES.login);
      }

      setTimeout(() => setInitializing(false), 500);
    },
    [router, dispatch, sessionUser]
  );

  useEffect(() => {
    // listen for auth state changes
    const res = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthStateChange(session);
    });

    const { subscription } = res?.data || {};
    return () => subscription.unsubscribe();
  }, [router.pathname, handleAuthStateChange]);

  if (initializing) return <PageLoader />;

  return <>{children}</>;
};

export { AuthHandler };
