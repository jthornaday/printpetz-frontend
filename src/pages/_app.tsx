import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReduxProvider } from "../context/ReduxProvider";
import { AuthGuard } from "@/context/AuthGuard";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ToastProvider } from "@/context/ToastProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <AuthGuard>
        <ToastProvider>
          <PageWrapper>
            <Component {...pageProps} />
          </PageWrapper>
        </ToastProvider>
      </AuthGuard>
    </ReduxProvider>
  );
}
