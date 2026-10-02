import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { isTrpcNotFound } from "../trpc/errors";
import { useTRPC } from "../trpc/react";

export const Route = createFileRoute("/properties/$propertyId")({
  loader: async ({ context, params }) => {
    const id = Number(params.propertyId);

    if (!Number.isInteger(id) || id <= 0) {
      throw notFound();
    }

    try {
      await context.queryClient.query({
        ...context.trpc.properties.byId.queryOptions({ id }),
        staleTime: "static",
      });
    } catch (error) {
      if (isTrpcNotFound(error)) {
        throw notFound();
      }

      throw error;
    }
  },
  notFoundComponent: PropertyNotFound,
  component: PropertyDetail,
});

function PropertyNotFound() {
  return (
    <main>
      <h1>Nie znaleziono</h1>
      <p>Property o podanym ID nie istnieje.</p>
      <p>
        <Link to="/">Wróć do listy</Link>
      </p>
    </main>
  );
}

function PropertyDetail() {
  const { propertyId } = Route.useParams();
  const trpc = useTRPC();
  const id = Number(propertyId);
  const propertyQuery = useQuery(trpc.properties.byId.queryOptions({ id }));

  if (propertyQuery.isPending) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  if (propertyQuery.isError) {
    if (isTrpcNotFound(propertyQuery.error)) {
      return <PropertyNotFound />;
    }

    return (
      <main>
        <h1>Property</h1>
        <p>Could not load property.</p>
        <p>
          <Link to="/">Wróć do listy</Link>
        </p>
      </main>
    );
  }

  const property = propertyQuery.data;

  return (
    <main>
      <p>
        <Link to="/">← Properties</Link>
      </p>
      <h1>{property.name}</h1>
      <p>ID: {property.id}</p>
    </main>
  );
}
