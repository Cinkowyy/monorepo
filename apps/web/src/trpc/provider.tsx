import type { AppRouter } from "@app/trpc/router";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { TRPCClient } from "@trpc/client";
import { type ReactNode, useState } from "react";
import { makeBrowserTrpcClient } from "./client";
import { TRPCProvider } from "./react";

type ProvidersProps = {
  children: ReactNode;
  queryClient: QueryClient;
};

export function Providers({ children, queryClient }: ProvidersProps) {
  const [trpcClient] = useState<TRPCClient<AppRouter>>(() =>
    makeBrowserTrpcClient(),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
