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

  async findManyAdmin() {
    return await prisma.product.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  async create(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrls: string[];
  }) {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        images: {
          create: data.imageUrls.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });
  }

  async softDelete(id: string) {
    return await prisma.product.update({
      where: { id },
      data: { active: false },
    });
  }
}
