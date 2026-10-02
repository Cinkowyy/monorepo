import { propertiesService } from "@app/core/properties/service";
import { z } from "zod";
import { publicProcedure, router } from "../init";

export const propertiesRouter = router({
  list: publicProcedure.query(() => {
    return propertiesService.getProperties();
  }),
  byId: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => {
      return propertiesService.getPropertyById(input.id);
    }),
});
