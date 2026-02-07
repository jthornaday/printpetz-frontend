export enum EToastType {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  INFO = "INFO",
}

export interface Toast {
  type: EToastType;
  message: string;
}
