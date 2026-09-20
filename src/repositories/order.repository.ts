import { prisma } from "../lib/prisma.js";

export class OrderRepository {
  async findCartWithProducts(userId: string) {
    return await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async createOrderAndClearCart(data: {
    userId: string;
    total: number;
    shippingAddress: string;
    orderItemsData: Array<{ productId: string; quantity: number; price: number }>;
    cartId: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Cria o pedido e os itens vinculados via createMany
      const newOrder = await tx.order.create({
        data: {
          userId: data.userId,
          total: data.total,
          status: "PENDING",
          shippingAddress: data.shippingAddress,
          items: {
            createMany: {
              data: data.orderItemsData,
            },
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // Esvazia os itens do carrinho dentro da mesma transação
      await tx.cartItem.deleteMany({
        where: { cartId: data.cartId },
      });

      return newOrder;
    });
  }

  async findManyByUserId(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}