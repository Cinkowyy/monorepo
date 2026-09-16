import z from "zod";
import type {
  ApiEndpointContract,
  InferContractTypes,
} from "../types/contract";

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
