import { OrderRepository } from "../repositories/order.repository.js";

const orderRepository = new OrderRepository();

export class OrderService {
  async processCheckout(userId: string, shippingAddress?: string) {
    const cart = await orderRepository.findCartWithProducts(userId);

    if (!cart || cart.items.length === 0) {
      throw new Error("Seu carrinho está vazio.");
    }

    //Calcula o total e prepara os dados dos itens do pedido
    let total = 0;
    const orderItemsData = cart.items.map((item) => {
      total += item.product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    const addressToUse = shippingAddress || "Endereço não informado";

    const order = await orderRepository.createOrderAndClearCart({
      userId,
      total,
      shippingAddress: addressToUse,
      orderItemsData,
      cartId: cart.id,
    });

    return order;
  }

  async getUserOrders(userId: string) {
    const orders = await orderRepository.findManyByUserId(userId);
    return orders;
  }
}