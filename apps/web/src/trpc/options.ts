import type { QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { createBrowserTrpcOptions } from "./client";
import { createServerTrpcOptions } from "./server.server";

export const createTrpcOptions = createIsomorphicFn()
  .server((queryClient: QueryClient) => createServerTrpcOptions(queryClient))
  .client((queryClient: QueryClient) => createBrowserTrpcOptions(queryClient));
