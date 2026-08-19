import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";

const cartRoutes = Router();

// Requisito 2: Adicionar produto ao carrinho
cartRoutes.post("/items", ensureAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Envie um array de itens com productId e quantity.",
      });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const operations = items.map((item) => {
      return prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: item.productId,
          },
        },
        update: {
          quantity: { increment: item.quantity },
        },
        create: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    });

    await prisma.$transaction(operations);

    const updatedCart = await prisma.cart.findUnique({
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

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Erro ao adicionar múltiplos itens:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao adicionar produtos ao carrinho." });
  }
});

// Requisito 2: Remover produto do carrinho
cartRoutes.delete("/items/:id", async (req, res) => {
  // TODO: Suas tarefas aqui
});

export { cartRoutes };
