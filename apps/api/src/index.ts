import { propertiesContract } from "@app/core/properties/contract";
import { propertiesService } from "@app/core/properties/service";
import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get(propertiesContract.getProperties.expressPath, async (_req, res) => {
  try {
    const properties = await propertiesService.getProperties();
    res.json(properties);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
