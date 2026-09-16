import type { z } from "zod";

export type ApiEndpointContractItem = {
  expressPath: string;
  getPath: (...args: any[]) => string;
  input?: z.ZodObject<{
    query?: z.ZodType;
    body?: z.ZodType;
    params?: z.ZodType;
  }>;
  output?: z.ZodType;
};

export type ApiEndpointContract = {
  [key: string]: ApiEndpointContractItem;
};

type InferZodOrUndefined<T> = T extends z.ZodType ? z.infer<T> : undefined;

type InferEndpointTypes<T extends ApiEndpointContractItem> = {
  input: {
    query: T["input"] extends z.ZodObject<{ query: infer Q extends z.ZodType }>
      ? InferZodOrUndefined<Q>
      : undefined;
    body: T["input"] extends z.ZodObject<{ body: infer B extends z.ZodType }>
      ? InferZodOrUndefined<B>
      : undefined;
    params: T["input"] extends z.ZodObject<{
      params: infer P extends z.ZodType;
    }>
      ? InferZodOrUndefined<P>
      : undefined;
  };
  output: InferZodOrUndefined<T["output"]>;
};

export type InferContractTypes<T extends ApiEndpointContract> = {
  [K in keyof T]: InferEndpointTypes<T[K]>;
};
