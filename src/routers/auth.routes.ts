import "dotenv/config";
import { Router } from "express";
import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authRoutes = Router();

// Cadastro de usuário
authRoutes.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    const userExist = await prisma.user.findUnique({ where: { email } });
    if (userExist) return res.status(409).json("Conflict");

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// Login
authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    if (await bcrypt.compare(password, user?.password)) {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } else {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export { authRoutes };
