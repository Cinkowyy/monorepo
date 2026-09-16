import { type PrismaClient, prisma } from "@app/db/client";

class PropertiesService {
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

export const propertiesService = new PropertiesService(prisma);
