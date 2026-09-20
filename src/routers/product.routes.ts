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

// Lista Todos os Produtos (Apenas Painel Admin - Ativos e Inativos)
productRoutes.get(
  "/admin/all",
  ensureAuthenticated,
  ensureAdmin,
  productController.listAdmin
);

//Encontra produto por ID
productRoutes.get("/:id", productController.getById);

// Criar Produto (Painel Admin)
// Apenas Administradores Autenticados
productRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  upload.array("images", 5),
  productController.create
);

// Soft Delete / Inativar Produto
productRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  productController.deactivate
);

export { productRoutes };
