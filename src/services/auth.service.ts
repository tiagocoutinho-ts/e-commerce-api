import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/auth.repository.js";

const authRepository = new AuthRepository();

interface RegisterDTO {
  name?: string;
  email?: string;
  password?: string;
}

interface LoginDTO {
  email?: string;
  password?: string;
}

export class AuthService {
  async registerUser(data: RegisterDTO) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new Error("Preencha todos os campos.");
    }

    const userExist = await authRepository.findByEmail(email);
    if (userExist) {
      throw new Error("E-mail já cadastrado.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser({
      name,
      email,
      passwordHash,
    });

    return user;
  }

  async authenticateUser(data: LoginDTO) {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Preencha todos os campos.");
    }

    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new Error("Credenciais inválidas.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Credenciais inválidas.");
    }

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "1d" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
