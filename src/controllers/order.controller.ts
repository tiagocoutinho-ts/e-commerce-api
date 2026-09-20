import { Request, Response } from "express";
import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export class OrderController {
  async checkout(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { shippingAddress } = req.body;

      const order = await orderService.processCheckout(userId, shippingAddress);

      return res.status(201).json(order);
    } catch (error: any) {
      if (error.message === "Seu carrinho está vazio.") {
        return res.status(400).json({ error: error.message });
      }

      console.error("Erro no checkout:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao processar checkout." });
    }
  }

  async listByUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const orders = await orderService.getUserOrders(userId);

      return res.status(200).json(orders);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      return res.status(500).json({ error: "Erro interno ao buscar pedidos." });
    }
  }
}
