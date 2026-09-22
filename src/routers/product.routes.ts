import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";
import { ensureAdmin } from "../middlewares/ensureAdmin.js";
import { upload } from "../lib/cloudinary.js";
import { ProductController } from "../controllers/product.controller.js";

const productRoutes = Router();
const productController = new ProductController();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Lista e pesquisa produtos públicos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo para pesquisa de produtos
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 */
productRoutes.get("/", productController.listPublic);

/**
 * @openapi
 * /products/admin/all:
 *   get:
 *     summary: Lista todos os produtos (Admin)
 *     description: Retorna ativos e inativos. Exclusivo para administradores autenticados.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (requer perfil de Administrador)
 */
productRoutes.get(
  "/admin/all",
  ensureAuthenticated,
  ensureAdmin,
  productController.listAdmin
);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Busca um produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do produto
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
productRoutes.get("/:id", productController.getById);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Cria um novo produto com imagens (Admin)
 *     description: Rota protegida para upload de até 5 imagens e dados do produto.
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Camiseta Minimalista
 *               description:
 *                 type: string
 *                 example: Camiseta 100% algodão
 *               price:
 *                 type: number
 *                 example: 79.90
 *               stock:
 *                 type: integer
 *                 example: 15
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Arquivos de imagem do produto (máximo 5)
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos ou campos faltando
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Apenas administradores
 */
productRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  upload.array("images", 5),
  productController.create
);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Inativa um produto (Soft Delete) (Admin)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a ser inativado
 *     responses:
 *       200:
 *         description: Produto inativado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Apenas administradores
 *       404:
 *         description: Produto não encontrado
 */
productRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  productController.deactivate
);

export { productRoutes };