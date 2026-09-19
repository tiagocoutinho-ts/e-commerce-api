import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export class ProductRepository {
  async findManyActive(search?: string) {
    const whereCondition: Prisma.ProductWhereInput = {
      active: true, 
      ...(search
        ? {
            OR: [
              { name: { contains: String(search)} },
              { description: { contains: String(search)} },
            ],
          }
        : {}),
    };

    return await prisma.product.findMany({
      where: whereCondition,
      include: { images: true },
    });
  }
}
