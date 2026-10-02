import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../trpc/react";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      context.trpc.properties.list.queryOptions(),
    );
  },
  component: Home,
});

function Home() {
  const trpc = useTRPC();
  const propertiesQuery = useQuery(trpc.properties.list.queryOptions());

  if (propertiesQuery.isPending) {
    return (
      <main>
        <h1>Properties</h1>
        <p>Loading...</p>
      </main>
    );
  }

  if (propertiesQuery.isError) {
    return (
      <main>
        <h1>Properties</h1>
        <p>Could not load properties.</p>
      </main>
    );
  }

  const properties = propertiesQuery.data;

  return (
    <main>
      <h1>Properties</h1>
      {properties.length === 0 ? (
        <p>No properties yet.</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property.id}>{property.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
