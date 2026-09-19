import { ProductRepository } from "../repositories/product.repository";

const productRepository = new ProductRepository();

export class ProductService {
  async listPublicProducts(search?: string) { 
    const products = await productRepository.findManyActive(search);
    return products;
  }
}