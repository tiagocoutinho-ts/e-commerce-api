import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";
import { CartController } from "../controllers/cart.controller.js";

const cartRoutes = Router();
const cartController = new CartController();

/**
 * @openapi
 * /cart:
 *   get:
 *     summary: Busca o carrinho do usuário logado
 *     description: Retorna o carrinho atual com todos os itens e produtos associados. Requer autenticação.
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carrinho retornado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Carrinho não encontrado
 */
cartRoutes.get("/", ensureAuthenticated, cartController.getByUser);

/**
 * @openapi
 * /cart/items:
 *   post:
 *     summary: Adiciona ou incrementa itens no carrinho
 *     description: Adiciona produtos ou aumenta a quantidade se já existirem no carrinho.
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "clz8921kd000008l46g3hx9zk"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item adicionado/atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou estoque insuficiente
 *       401:
 *         description: Não autorizado
 */
cartRoutes.post("/items", ensureAuthenticated, cartController.addItems);

/**
 * @openapi
 * /cart/items:
 *   put:
 *     summary: Atualiza a quantidade exata de um item
 *     description: Define uma nova quantidade para o item no carrinho. Se quantity for menor ou igual a 0, o item é removido.
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "clz8921kd000008l46g3hx9zk"
 *               quantity:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Quantidade atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Item não encontrado no carrinho
 */
cartRoutes.put("/items", ensureAuthenticated, cartController.updateItems);

/**
 * @openapi
 * /cart/clear:
 *   delete:
 *     summary: Esvazia o carrinho inteiro
 *     description: Remove todos os itens do carrinho do usuário logado.
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carrinho esvaziado com sucesso
 *       401:
 *         description: Não autorizado
 */
cartRoutes.delete("/clear", ensureAuthenticated, cartController.clear);

/**
 * @openapi
 * /cart/items/{id}:
 *   delete:
 *     summary: Remove um item específico do carrinho
 *     description: Remove o item do carrinho com base no ID do item do carrinho.
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do item dentro do carrinho
 *     responses:
 *       200:
 *         description: Item removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Item não encontrado
 */
cartRoutes.delete("/items/:id", ensureAuthenticated, cartController.removeItem);
export { cartRoutes };
