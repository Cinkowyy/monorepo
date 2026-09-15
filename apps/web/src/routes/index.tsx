import { buildingService } from "@app/core";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getBuildings = createServerFn({ method: "GET" }).handler(() => {
  return buildingService.list();
});

export const Route = createFileRoute("/")({
  loader: () => getBuildings(),
  component: Home,
});

function Home() {
  const buildings = Route.useLoaderData();

  return (
    <main>
      <h1>Buildings</h1>
      {buildings.length === 0 ? (
        <p>No buildings yet.</p>
      ) : (
        <ul>
          {buildings.map((building) => (
            <li key={building.id}>
              {building.name}
              {building.address ? ` — ${building.address}` : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
