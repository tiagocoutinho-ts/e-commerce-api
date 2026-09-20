import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const user = await authService.registerUser({ name, email, password });

      return res.status(201).json({ user });
    } catch (error: any) {
      if (error.message === "Preencha todos os campos.") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "E-mail já cadastrado.") {
        return res.status(409).json({ error: error.message });
      }

      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const authResult = await authService.authenticateUser({
        email,
        password,
      });

      return res.status(200).json(authResult);
    } catch (error: any) {
      if (error.message === "Preencha todos os campos.") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Credenciais inválidas.") {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }
}
