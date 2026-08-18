import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";
import { ensureAdmin } from "../middlewares/ensureAdmin.js";
import { upload } from "../lib/cloudinary.js";

const productRoutes = Router();

// Requisito 3: Listar e Pesquisar Produtos (Público)
productRoutes.get("/", async (req, res) => {
  // TODO: Suas tarefas aqui:
  // 1. Pegar parâmetros de busca/filtro via req.query (ex: /products?search=camiseta)
  // 2. Consultar produtos no Prisma incluindo as imagens (include: { images: true })
  // 3. Retornar lista de produtos
});

// Criar Produto (Painel Admin)
// Apenas Administradores Autenticados
productRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { name, description, price, stock } = req.body;
      if (!name || price === undefined) {
        return res
          .status(400)
          .json({ error: "Nome e preço são obrigatórios." });
      }

      const files = req.files as Express.Multer.File[];

      const imageUrls = files?.map((file) => file.path) || [];

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: Number(price),
          stock: stock ? Number(stock) : 0,
          images: {
            create: imageUrls.map((url) => ({ url: url })),
          },
        },
        include: {
          images: true,
        },
      });

      return res.status(201).json(product);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro interno ao cadastrar produto." });
    }
  }
);

export { productRoutes };
