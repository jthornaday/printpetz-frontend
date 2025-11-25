import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { clearAuth, setUser } from "@/store/slices/authSlice";
import { ROUTES } from "@/routes";
import { PageLoader } from "../ui/loader";
import { supabase } from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import { authRoutes } from "@/utils/constants/appConstants";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSupabaseAuthUser } from "@/store/slices/supabaseUserSlice";
import { useLazyGetUserByIdQuery } from "@/store/api/userApi";

type Props = { children: React.ReactNode };

const AuthHandler = ({ children }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  const [initializing, setInitializing] = useState(true);

  const [getUser, { isFetching }] = useLazyGetUserByIdQuery();

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
      if (user === null) {
        dispatch(clearAuth());

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
        console.log(session);

        if (session) {
          dispatch(setSupabaseAuthUser(session.user));
          const { data } = await getUser(session.user.id);
          dispatch(setUser(data ?? null));
        } else {
          dispatch(setUser(null));
        }

        setTimeout(() => setInitializing(false), 500);
      } catch (error) {
        console.error("Auth error:", error);
        dispatch(setUser(null));
      }
    },
    [dispatch, router]
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
