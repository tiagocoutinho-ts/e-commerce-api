import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { authRoutes } from "./routers/auth.routes.js";
import { productRoutes } from "./routers/product.routes.js";
import { cartRoutes } from "./routers/cart.routes.js";
import { orderRoutes } from "./routers/order.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/docs 📄`);
});