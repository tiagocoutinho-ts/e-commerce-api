import { CartRepository } from "../repositories/cart.repository";

const cartRepository = new CartRepository();

export class CartService {
  async getCartByUserId(userId: string) {
    const cart = await cartRepository.findByUserId(userId);

    if (!cart) {
      return { items: [] };
    }

    return cart;
  }

  async addItemsToCart(userId: string, items: Array<{ productId: string; quantity: number }>) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Envie um array de itens com productId e quantity.");
    }

    // Garante que o carrinho existe
    const cart = await cartRepository.findOrCreateCart(userId);

    await cartRepository.upsertCartItems(cart.id, items);

    return await cartRepository.findByUserId(userId);
  }

  async updateCartItems(userId: string, items: Array<{ productId: string; quantity: number }>) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Envie um array de itens com productId e quantity.");
    }

    const cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      throw new Error("Carrinho não encontrado.");
    }

    await cartRepository.updateCartItemsBatch(cart.id, items);

    return await cartRepository.findByUserId(userId);
  }

  async removeItemFromCart(userId: string, itemId: string) {
    if (!itemId) {
      throw new Error("ID do item é obrigatório.");
    }

    const cartItem = await cartRepository.findCartItemByIdAndUser(itemId, userId);
    if (!cartItem) {
      throw new Error("Item não encontrado no carrinho deste usuário.");
    }

    await cartRepository.deleteCartItem(itemId);

    // Retorna o carrinho atualizado completo
    return await cartRepository.findByUserId(userId);
  }

  async clearUserCart(userId: string) {
    const cart = await cartRepository.findByUserId(userId);
    
    if (cart) {
      await cartRepository.clearCartItems(cart.id);
    }

    return { message: "Carrinho esvaziado com sucesso." };
  }
}