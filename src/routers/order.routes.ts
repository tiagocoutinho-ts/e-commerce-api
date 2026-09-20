import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";
import { OrderController } from "../controllers/order.controller.js";

const orderRoutes = Router();
const orderController = new OrderController();

// Finalizar a compra (Checkout)
orderRoutes.post("/checkout", ensureAuthenticated, orderController.checkout);

// Buscar histórico de pedidos do usuário
orderRoutes.get("/my-orders", ensureAuthenticated, orderController.checkout);

export { orderRoutes };