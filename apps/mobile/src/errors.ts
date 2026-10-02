import { TRPCClientError } from "@trpc/client";

export function isTrpcNotFound(error: unknown): boolean {
  return (
    error instanceof TRPCClientError && error.data?.code === "NOT_FOUND"
  );
}
