import type { Request, Response } from "express";
import { ProductService } from "../services/product.service";

const productService = new ProductService();

export class ProductController {
  async listPublic(req: Request, res: Response) {
    try {
      const { search } = req.query;

      const products = await productService.listPublicProducts(
        search ? String(search) : undefined
      );

      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar produtos." });
    }
  }
}