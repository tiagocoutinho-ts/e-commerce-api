import "dotenv/config";
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const authRoutes = Router();
const authController = new AuthController();

// Cadastro de usuário
authRoutes.post("/register", authController.register);
// Login
authRoutes.post("/login", authController.login);

export { authRoutes };
