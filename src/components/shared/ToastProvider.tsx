import { cva } from "class-variance-authority";
import React, { createContext, useCallback } from "react";
import { Toaster, toast as reactHotToast } from "react-hot-toast";

type ToastTypes = "SUCCESS" | "ERROR" | "LOADING" | "WARNING";

const toastStyle = cva("rounded px-4 py-2 shadow-md", {
  variants: {
    type: {
      SUCCESS: "bg-primary text-white",
      ERROR: "bg-red-500 text-white",
      LOADING: "bg-blue-600 text-white",
      WARNING: "bg-white",
    },
  },
});

const ToastContext = createContext({
  toast: (type: ToastTypes, message: string) => {},
});

// Toast provider component
const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useCallback((type: ToastTypes, message: string) => {
    reactHotToast.remove();
    switch (type) {
      case "LOADING":
        reactHotToast.loading(message ?? "Loading...", {
          className: toastStyle({ type }),
        });
        break;
      case "SUCCESS":
        reactHotToast.success(message, {
          className: toastStyle({ type }),
          duration: 4000,
        });
        break;
      case "ERROR":
        reactHotToast.error(message, {
          className: toastStyle({ type }),
          duration: 4000,
        });
        break;
      case "WARNING":
        reactHotToast.error(message, {
          className: toastStyle({ type }),
          duration: Infinity,
          icon: "⚠️",
        });
        break;
      default:
        break;
    }
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster position="top-center" gutter={1} />
    </ToastContext.Provider>
  );
};

export { ToastContext, ToastProvider };
