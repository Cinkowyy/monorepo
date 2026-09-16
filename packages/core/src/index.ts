import { prisma } from "@app/db";
import { PropertiesService } from "./properties.js";

export type { PropertiesContractTypes } from "./properties.js";
export { PropertiesService, propertiesContract } from "./properties.js";
export type {
  ApiEndpointContract,
  InferContractTypes,
} from "./types/contract.js";

export const propertiesService = new PropertiesService(prisma);
