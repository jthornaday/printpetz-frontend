/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { InferType } from "yup";

import type { envConfigSchema } from "./next.config.mjs";

type CamelCase<S extends string> = S extends `NEXT_PUBLIC_${infer P}_${infer Rest}`
  ? P extends ""
    ? CamelCase<Rest>
    : `${Lowercase<P>}${CamelCase<Rest> extends string ? Capitalize<CamelCase<Rest>> : ""}`
  : S extends `${infer P}_${infer Rest}`
  ? `${Lowercase<P>}${Capitalize<CamelCase<Rest>>}`
  : Lowercase<S>;

type CamelCaseKeys<T> = {
  [K in keyof T as CamelCase<K & string>]: T[K];
};

type EnvConfig = CamelCaseKeys<
  InferType<typeof envConfigSchema>
> /* & InferType<typeof envConfigSchema> */; // uncomment this if wanted to use NEXT_PUBLIC_{variable}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvConfig {}
  }
}
