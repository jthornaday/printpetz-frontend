import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReduxProvider } from "../components/shared/ReduxProvider";
import { AuthHandler } from "@/components/shared/AuthHandler";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ToastProvider } from "@/components/shared/ToastProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <AuthHandler>
        <ToastProvider>
          <PageWrapper>
            <Component {...pageProps} />
          </PageWrapper>
        </ToastProvider>
      </AuthHandler>
    </ReduxProvider>
  );
}
