import { CreateProductDTO } from "../controllers/product.types";
import { ProductRepository } from "../repositories/product.repository";

const productRepository = new ProductRepository();

export class ProductService {
  async listPublicProducts(search?: string) { 
    const products = await productRepository.findManyActive(search);
    return products;
  }

  async listAdminProducts() {
    const products = await productRepository.findManyAdmin();
    return products;
  }

  async findById(id: string) {
    const product = await productRepository.findById(id);
  
    if (!product) {
      throw new Error("Produto não encontrado."); 
    }
  
    return product;
  }

  async createProduct(data: CreateProductDTO) {
    if (!data.name || data.price === undefined) {
      throw new Error("Nome e preço são obrigatórios.");
    }

    const files = data.files || [];
    const imageUrls = files.map((file: any) => file.path || file.secure_url);

    const product = await productRepository.create({
      name: data.name,
      description: String(data.description),
      price: Number(data.price),
      stock: data.stock ? Number(data.stock) : 0,
      imageUrls,
    });

    return product;
  }

  async deactivateProduct(id: string) {
    if (!id) {
      throw new Error("ID inválido.");
    }

    const productExists = await productRepository.findById(id);
    if (!productExists) {
      throw new Error("Produto não encontrado.");
    }

    const product = await productRepository.softDelete(id);
    return product;
  }
}