import { Request, Response } from "express";
import { CartService } from "../services/cart.service.ts";

const cartService = new CartService();

export class CartController {
  async getByUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const cart = await cartService.getCartByUserId(userId);

      return res.status(200).json(cart);
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar carrinho." });
    }
  }

  async addItems(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { items } = req.body;

      const updatedCart = await cartService.addItemsToCart(userId, items);

      return res.status(200).json(updatedCart);
    } catch (error: any) {
      if (
        error.message === "Envie um array de itens com productId e quantity."
      ) {
        return res.status(400).json({ error: error.message });
      }

      console.error("Erro ao adicionar múltiplos itens:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao adicionar produtos ao carrinho." });
    }
  }

  async updateItems(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { items } = req.body;

      const updatedCart = await cartService.updateCartItems(userId, items);

      return res.status(200).json(updatedCart);
    } catch (error: any) {
      if (
        error.message === "Envie um array de itens com productId e quantity."
      ) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Carrinho não encontrado.") {
        return res.status(404).json({ error: error.message });
      }

      console.error("Erro ao atualizar itens do carrinho:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao atualizar produtos do carrinho." });
    }
  }

  async removeItem(req: Request<{ id: string }>, res: Response) {
    try {
      const userId = (req as any).user.id;
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : String(req.params.id);

      const updatedCart = await cartService.removeItemFromCart(userId, id);

      return res.status(200).json(updatedCart);
    } catch (error: any) {
      if (error.message === "ID do item é obrigatório.") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Item não encontrado no carrinho deste usuário.") {
        return res.status(404).json({ error: error.message });
      }

      console.error("Erro ao remover item do carrinho:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao remover item do carrinho." });
    }
  }

  async clear(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const result = await cartService.clearUserCart(userId);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao esvaziar carrinho:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao esvaziar carrinho." });
    }
  }
}
