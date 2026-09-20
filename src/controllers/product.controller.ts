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

  async listAdmin(_, res: Response) {
    try {
      const products = await productService.listAdminProducts();
      return res.json(products);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao buscar produtos do admin." });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product = await productService.findById(String(id));

      return res.status(200).json(product);
    } catch (error: any) {
      return res
        .status(404)
        .json({ error: error.message || "Produto não encontrado." });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, description, price, stock } = req.body;
      const files = req.files as Express.Multer.File[];

      const product = await productService.createProduct({
        name,
        description,
        price,
        stock,
        files,
      });

      return res.status(201).json(product);
    } catch (error: any) {
      if (error.message === "Nome e preço são obrigatórios.") {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Erro interno ao cadastrar produto." });
    }
  }

  async deactivate(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;

      const product = await productService.deactivateProduct(id);

      return res.status(200).json({
        message: "Produto desativado com sucesso.",
        product,
      });
      
    } catch (error: any) {
      if (error.message === "ID inválido.") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Produto não encontrado.") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "Erro interno ao desativar produto." });
    }
  }
}
