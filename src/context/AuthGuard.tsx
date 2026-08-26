import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { ROUTES } from "@/routes";
import { supabase } from "@/services/supabase";
import { publicRoutes } from "@/utils/constants/appConstants";
import { useAppDispatch, useAppSelector } from "@/store";
import { supabaseBaseApi } from "@/store/api/baseApi";
import { clearSessionUser, setSessionUser } from "@/store/slices/sessionUserSlice";
import { PageLoader } from "../components/ui/loader";

type AuthGuardProps = { children: React.ReactNode };

const isPublicRoute = (pathname: string) => publicRoutes.includes(pathname);

const INIT_DELAY_MS = 500;

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sessionUserId = useAppSelector((s) => s.sessionUser?.id);

  const [isInitializing, setIsInitializing] = useState(true);

  // Ref keeps `sessionUserId` fresh inside the callback without
  // triggering effect re-runs or re-creating the subscription.
  const sessionUserIdRef = useRef(sessionUserId);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  sessionUserIdRef.current = sessionUserId;

  useEffect(() => {
    const handleSession = (event: AuthChangeEvent, session: Session | null) => {
      try {
        if (session) {
          handleAuthenticated(event, session);
        } else {
          handleUnauthenticated();
        }
      } catch (error) {
        console.error("Auth state handling failed:", error);
        router.replace(ROUTES.login);
      } finally {
        // Small delay so the loader doesn't flash on fast connections.
        setTimeout(() => setIsInitializing(false), INIT_DELAY_MS);
      }
    };

    const scheduleRedirect = (route: string) => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);

      // Supabase recommends returning from onAuthStateChange before starting
      // work that may read the newly-created session. Deferring navigation by
      // one tick prevents profile queries from racing the SIGNED_IN event.
      redirectTimerRef.current = setTimeout(() => router.replace(route), 0);
    };

    const handleAuthenticated = (event: AuthChangeEvent, session: Session) => {
      const isNewUser = sessionUserIdRef.current !== session.user.id;
      if (isNewUser) dispatch(setSessionUser(session.user));

      if (event === "SIGNED_IN" || isNewUser) {
        dispatch(supabaseBaseApi.util.resetApiState());
      }

      // Redirect authenticated users away from public routes (login, signup, etc.)
      // but skip during signup OTP flow where email isn't confirmed yet.
      const isEmailConfirmed = !!session.user.email_confirmed_at;
      if (isEmailConfirmed && isPublicRoute(router.pathname)) {
        scheduleRedirect(ROUTES.create);
      }
    };

    const handleUnauthenticated = () => {
      if (isPublicRoute(router.pathname)) return;

      dispatch(clearSessionUser());
      dispatch(supabaseBaseApi.util.resetApiState());
      router.replace(ROUTES.login);
    };

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      handleSession(event, session);
    });

    return () => {
      data.subscription.unsubscribe();
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [router, dispatch]);

  // Show loader while initializing OR while redirecting an unauthenticated
  // user away from a protected route (prevents page content flash).
  const isRedirecting = !sessionUserId && !isPublicRoute(router.pathname);

  if (isInitializing || isRedirecting) return <PageLoader />;

  return <>{children}</>;
};

export { AuthGuard };
