import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";
import { ensureAdmin } from "../middlewares/ensureAdmin.js";
import { upload } from "../lib/cloudinary.js";

const productRoutes = Router();

// Listar e Pesquisar Produtos (Público)
productRoutes.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    const products = await prisma.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: String(search) } },
              { description: { contains: String(search) } },
            ],
          }
        : undefined,
      include: { images: true },
    });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

//Encontra produto por ID
productRoutes.get("/product/:id", async (req, res) => {
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

export { productRoutes };
