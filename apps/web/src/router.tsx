import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { getQueryClient } from "./trpc/client";
import { createTrpcOptions } from "./trpc/options";

export function getRouter() {
  const queryClient = getQueryClient();
  const trpc = createTrpcOptions(queryClient);

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      trpc,
    },
    scrollRestoration: true,
    defaultPreload: "intent",
  });

  return router;
}
