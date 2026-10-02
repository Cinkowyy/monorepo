import { createContext } from "@app/trpc/context";
import type { AppRouter } from "@app/trpc/router";
import { appRouter } from "@app/trpc/router";
import type { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, unstable_localLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

export function makeServerTrpcClient() {
  return createTRPCClient<AppRouter>({
    links: [
      unstable_localLink({
        router: appRouter,
        createContext: async () => createContext(),
        transformer: superjson,
      }),
    ],
  });
}

export function createServerTrpcOptions(queryClient: QueryClient) {
  return createTRPCOptionsProxy<AppRouter>({
    client: makeServerTrpcClient(),
    queryClient,
  });
}
