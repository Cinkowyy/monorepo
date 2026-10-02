import { prisma } from "@app/db/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../init";

export const propertiesRouter = router({
  list: publicProcedure.query(() => {
    return prisma.properties.findMany();
  }),
  byId: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const property = await prisma.properties.findUnique({
        where: { id: input.id },
      });

      if (!property) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Property not found",
        });
      }

      return property;
    }),
});
