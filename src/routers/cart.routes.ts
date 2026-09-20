import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";
import { CartController } from "../controllers/cart.controller.js";

const cartRoutes = Router();
const cartController = new CartController();

// Buscar o carrinho do usuário logado (com itens e produtos associados)
cartRoutes.get("/", ensureAuthenticated, cartController.getByUser);

// Adicionar ou incrementar múltiplos itens no carrinho
cartRoutes.post("/items", ensureAuthenticated, cartController.addItems);

// Atualizar a quantidade exata de itens no carrinho (ou removê-los se quantity <= 0)
cartRoutes.put("/items", ensureAuthenticated, cartController.updateItems);

// Esvaziar o carrinho inteiro 
cartRoutes.delete("/clear", ensureAuthenticated, cartController.clear);

// Remover um item específico do carrinho pelo ID do item
cartRoutes.delete("/items/:id", ensureAuthenticated, cartController.removeItem);

export { cartRoutes };
