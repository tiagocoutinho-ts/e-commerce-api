import { prisma } from "../lib/prisma";

export class CartRepository {
  async findByUserId(userId: string) {
    return await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async findOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  async upsertCartItems(
    cartId: string,
    items: Array<{ productId: string; quantity: number }>
  ) {
    const operations = items.map((item) => {
      return prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId,
            productId: item.productId,
          },
        },
        update: {
          quantity: { increment: item.quantity },
        },
        create: {
          cartId,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    });

    return await prisma.$transaction(operations);
  }

  async updateCartItemsBatch(cartId: string, items: Array<{ productId: string; quantity: number }>) {
    const operations = items.map((item) => {
      if (item.quantity <= 0) {
        return prisma.cartItem.deleteMany({
          where: {
            cartId,
            productId: item.productId,
          },
        });
      }

      return prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId,
            productId: item.productId,
          },
        },
        update: {
          quantity: item.quantity, 
        },
        create: {
          cartId,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    });

    return await prisma.$transaction(operations);
  }

  async findCartItemByIdAndUser(itemId: string, userId: string) {
    return await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
    });
  }

  async deleteCartItem(itemId: string) {
    return await prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCartItems(cartId: string) {
    return await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
