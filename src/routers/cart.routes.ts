import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";

const cartRoutes = Router();

// Adicionar produto ao carrinho
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

// Remover produto do carrinho
cartRoutes.delete("/items/:id", ensureAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "ID do item é obrigatório." });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId,
        },
      },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ error: "Item não encontrado no carrinho deste usuário." });
    }

    await prisma.cartItem.delete({
      where: { id },
    });

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
    console.error("Erro ao remover item do carrinho:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao remover item do carrinho." });
  }
});

cartRoutes.delete("/clear", ensureAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return res.status(200).json({ message: "Carrinho esvaziado com sucesso." });
  } catch (error) {
    console.error("Erro ao esvaziar carrinho:", error);
    return res.status(500).json({ error: "Erro interno ao esvaziar carrinho." });
  }
});

export { cartRoutes };
