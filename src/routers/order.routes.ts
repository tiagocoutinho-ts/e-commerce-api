import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";
import { OrderController } from "../controllers/order.controller.js";

const orderRoutes = Router();
const orderController = new OrderController();

/**
 * @openapi
 * /orders/checkout:
 *   post:
 *     summary: Realiza o checkout e finaliza a compra
 *     description: Converte os itens do carrinho atual em um novo pedido, processa a compra e limpa o carrinho. Requer autenticação.
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Pedido realizado com sucesso
 *       400:
 *         description: Carrinho vazio ou estoque insuficiente
 *       401:
 *         description: Token não fornecido ou inválido
 */
orderRoutes.post("/checkout", ensureAuthenticated, orderController.checkout);

/**
 * @openapi
 * /orders/my-orders:
 *   get:
 *     summary: Busca o histórico de pedidos do usuário logado
 *     description: Retorna todos os pedidos já realizados pelo usuário autenticado.
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Histórico de pedidos retornado com sucesso
 *       401:
 *         description: Não autorizado
 */
orderRoutes.get("/my-orders", ensureAuthenticated, orderController.checkout);

export { orderRoutes };