import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const authRoutes = Router();
const authController = new AuthController();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Cadastro de novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: username
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Preencha todos os campos
 *       409:
 *         description: E-mail já cadastrado
 */
authRoutes.post("/register", authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso. O token JWT é enviado via cookie HTTP-only.
 *         headers:
 *           Set-Cookie:
 *             description: Cookie contendo o token JWT de autenticação.
 *             schema:
 *               type: string
 *               example: token=abc123xyz; Path=/; HttpOnly; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso!
 *       401:
 *         description: Credenciais inválidas
 */
authRoutes.post("/login", authController.login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Realiza o logout do usuário limpando o cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso. O cookie de autenticação foi removido.
 */
authRoutes.post("/logout", authController.logout);

export { authRoutes };