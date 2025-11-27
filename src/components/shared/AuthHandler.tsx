import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { ROUTES } from "@/routes";
import { PageLoader } from "../ui/loader";
import { supabase } from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import { authRoutes } from "@/utils/constants/appConstants";
import { useAppDispatch, useAppSelector } from "@/store";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import { supabaseBaseApi } from "@/store/api/baseApi";
import { clearSessionUser, setSessionUser } from "@/store/slices/sessionUserSlice";

type Props = { children: React.ReactNode };

const AuthHandler = ({ children }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [initializing, setInitializing] = useState(true);
  const wasLoggedIn = useRef(false);

  const { data, refetch: refetchUser } = useGetUserByIdQuery();
  const { data: user } = data || {};

  useEffect(() => {
    // Still loading user → keep initializing
    if (user === undefined) {
      setInitializing(true);
      return;
    }

    // User resolved → stop initializing smoothly
    const timer = setTimeout(() => {
      setInitializing(false);

      // No user → logout & redirect
      if (!user) {
        dispatch(clearSessionUser());

        if (!authRoutes.includes(router.pathname)) {
          router.replace(ROUTES.login);
        }
        return;
      }

      // User exists → redirect if needed
      if (authRoutes.includes(router.pathname)) {
        router.replace(ROUTES.create);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [user, router.pathname]);

  const handleAuthStateChange = useCallback(
    async (session: Session | null) => {
      try {
        dispatch(clearSessionUser());

        if (session) {
          wasLoggedIn.current = true;
          dispatch(setSessionUser(session.user));
        } else {
          dispatch(clearSessionUser());
          if (wasLoggedIn.current) {
            dispatch(supabaseBaseApi.util.resetApiState());
            wasLoggedIn.current = false;
          }
        }

        refetchUser();

        setTimeout(() => setInitializing(false), 500);
      } catch (error) {
        console.error("Auth error:", error);
        if (wasLoggedIn.current) {
          dispatch(supabaseBaseApi.util.resetApiState());
          wasLoggedIn.current = false;
        }
      }
    },
    [router, dispatch]
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
