import { router } from "./init";
import { propertiesRouter } from "./routers/properties";

export const appRouter = router({
  properties: propertiesRouter,
});

export type AppRouter = typeof appRouter;
