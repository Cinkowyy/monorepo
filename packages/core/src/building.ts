import { type Building, prisma } from "@app/db";
import { z } from "zod";

export const createBuildingSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  userId: z.number().int().positive().optional(),
});

export type CreateBuildingInput = z.infer<typeof createBuildingSchema>;

export const buildingService = {
  list(): Promise<Building[]> {
    return prisma.building.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  create(input: CreateBuildingInput): Promise<Building> {
    const data = createBuildingSchema.parse(input);

    return prisma.building.create({ data });
  },
};
