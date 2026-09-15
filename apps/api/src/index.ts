import { buildingService, createBuildingSchema } from "@app/core";
import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/buildings", async (_req, res) => {
  try {
    const buildings = await buildingService.list();
    res.json(buildings);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/buildings", async (req, res) => {
  const parsed = createBuildingSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const building = await buildingService.create(parsed.data);
    res.status(201).json(building);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
