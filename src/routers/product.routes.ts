import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";
import { ensureAdmin } from "../middlewares/ensureAdmin.js";
import { upload } from "../lib/cloudinary.js";
import { ProductController } from "../controllers/product.controller.js";

const productRoutes = Router();
const productController = new ProductController();

// Listar e Pesquisar Produtos (Público)
productRoutes.get("/", productController.listPublic);

// Listar Todos os Produtos (Apenas Painel Admin - Ativos e Inativos)
productRoutes.get(
  "/admin/all",
  ensureAuthenticated,
  ensureAdmin,
  async (req: Request, res: Response) => {
    try {
      const products = await prisma.product.findMany({
        include: { images: true },
        orderBy: { createdAt: "desc" },
      });

      return res.json(products);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao buscar produtos do admin." });
    }
  }
);

//Encontra produto por ID
productRoutes.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    return res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Produto não encontrado." });
  }
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

      const imageUrls = files.map((file: any) => file.path || file.secure_url);

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

// Soft Delete / Inativar Produto
productRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "ID inválido." });
      }

      const product = await prisma.product.update({
        where: { id },
        data: { active: false },
      });

      return res.status(200).json({
        message: "Produto desativado com sucesso.",
        product,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro interno ao desativar produto." });
    }
  }
);

export { productRoutes };
