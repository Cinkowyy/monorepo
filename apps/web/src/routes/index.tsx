import { propertiesService } from "@app/core";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getProperties = createServerFn({ method: "GET" }).handler(() => {
  return propertiesService.getProperties();
});

export const Route = createFileRoute("/")({
  loader: () => getProperties(),
  component: Home,
});

function Home() {
  const properties = Route.useLoaderData();

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
