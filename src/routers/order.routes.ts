import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";

const orderRoutes = Router();

// Finalizar a compra (Checkout)
orderRoutes.post("/checkout", ensureAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { shippingAddress } = req.body;

    // Buscar o carrinho atual do usuário com os produtos
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Seu carrinho está vazio." });
    }

    // Calcula o total e prepara os itens do pedido
    let total = 0;
    const orderItemsData = cart.items.map((item) => {
      total += item.product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    // 3. Transação: Cria o pedido com o endereço e limpa o carrinho
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: "PENDING",
          shippingAddress: shippingAddress || "Endereço não informado",
          items: {
            createMany: {
              data: orderItemsData,
            },
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // Esvazia os itens do carrinho após fechar o pedido
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("Erro no checkout:", error);
    return res.status(500).json({ error: "Erro interno ao processar checkout." });
  }
});

// Buscar histórico de pedidos do usuário
orderRoutes.get("/my-orders", ensureAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const orders = await prisma.order.findMany({
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

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return res.status(500).json({ error: "Erro interno ao buscar pedidos." });
  }
});

export { orderRoutes };