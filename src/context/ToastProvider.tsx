import { EToastType } from "@/types/toast";
import { cva } from "class-variance-authority";
import React, { createContext, useCallback } from "react";
import { Toaster, toast as reactHotToast } from "react-hot-toast";

const toastStyle = cva("rounded px-4 py-2 shadow-md", {
  variants: {
    type: {
      SUCCESS: "bg-primary text-white",
      ERROR: "bg-red-500 text-white",
      LOADING: "bg-blue-600 text-white",
      INFO: "bg-white",
    },
  },
});

const ToastContext = createContext({
  toast: (type: EToastType, message: string) => {},
});

// Toast provider component
const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useCallback((type: EToastType, message: string) => {
    reactHotToast.remove();
    switch (type) {
      case EToastType.SUCCESS:
        reactHotToast.success(message, {
          className: toastStyle({ type }),
          duration: 4000,
        });
        break;
      case EToastType.ERROR:
        reactHotToast.error(message, {
          className: toastStyle({ type }),
          duration: 4000,
        });
        break;
      case EToastType.INFO:
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
