import type { PrismaClient } from "@app/db";
import z from "zod";
import type {
  ApiEndpointContract,
  InferContractTypes,
} from "./types/contract.js";

export const propertiesContract = {
  getProperties: {
    expressPath: "/properties",
    getPath: () => "/properties",
    output: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    ),
  },
  getPropertyById: {
    expressPath: "/properties/:id",
    getPath: (id: string) => `/properties/${id}`,
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
    }),
    output: z.object({
      id: z.string(),
      name: z.string(),
    }),
  },
} satisfies ApiEndpointContract;

export type PropertiesContractTypes = InferContractTypes<
  typeof propertiesContract
>;

export class PropertiesService {
  constructor(private readonly prisma: PrismaClient) {}

  async getProperties() {
    const properties = await this.prisma.properties.findMany();
    return properties;
  }

  async getPropertyById(id: number) {
    const property = await this.prisma.properties.findUnique({
      where: {
        id,
      },
    });

    // TODO: Add custom error handling
    if (!property) {
      throw new Error("Property not found");
    }

    return property;
  }
}
